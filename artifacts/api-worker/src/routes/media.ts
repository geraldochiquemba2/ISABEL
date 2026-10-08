import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const mediaRouter = new Hono<{ Bindings: Env }>();

// Storage de imagens no Workers: R2 (bucket YESOLA_IMAGES) em vez de disco.
// Chaves: `full/<fileId>.jpg` e `thumb/<fileId>.jpg`.
// - Uploads novos: o cliente envia cheia (1920px) + thumb (480px) e ambas vão
//   diretas para o R2 (sem sharp no edge; ver @/lib/api uploadImage).
// - Legado Telegram: migração preguiçosa — no primeiro GET sem R2, busca ao
//   Telegram UMA vez e grava no R2; daí em diante serve do R2 + CDN.
// - URLs mantidas: `/api/media/image/<fileId>[?size=thumb]` (zero mudanças
//   no frontend para leitura).

const fullKey = (fileId: string) => `full/${fileId}.jpg`;
const thumbKey = (fileId: string) => `thumb/${fileId}.jpg`;
const isFileId = (s: string) => /^[\w-]{5,200}$/.test(s);

// Cooldown global anti-ban best-effort (memória por isolate): quando o
// Telegram responde 429 com retry_after, todo o tráfego Bot API pausa.
let telegramCooldownUntil = 0;

async function waitTelegramCooldown(): Promise<void> {
  const wait = telegramCooldownUntil - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
}

async function readRetryAfter(res: Response): Promise<number> {
  try {
    const data = (await res.clone().json()) as any;
    const ra = Number(data?.parameters?.retry_after);
    if (Number.isFinite(ra) && ra > 0) return Math.min(ra, 300) * 1000;
  } catch {
    /* corpo não-JSON (ficheiros) */
  }
  return 0;
}

function looksLikeImage(buf: Uint8Array): boolean {
  if (!buf || buf.length < 64) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true; // PNG
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true; // GIF
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  )
    return true; // WEBP
  return false;
}

function b64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/^data:image\/\w+;base64,/, "");
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Deduplica fetches concorrentes do mesmo fileId ao Telegram.
const inflight = new Map<string, Promise<{ full: Uint8Array; thumb: Uint8Array } | null>>();

// Endpoint helper para carregar imagem: R2 primeiro, Telegram como arquivo.
mediaRouter.post("/upload", async (c) => {
  try {
    const { imageBase64, thumbBase64, filename } = await c.req.json();
    if (!imageBase64) {
      return c.json({ error: "Nenhuma imagem em base64 foi enviada." }, 400);
    }

    const token = c.env.TELEGRAM_BOT_TOKEN;
    const chatId = c.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return c.json({ error: "Configuração do Telegram incompleta no servidor." }, 500);
    }

    const full = b64ToBytes(String(imageBase64));
    if (full.length > 20 * 1024 * 1024) return c.json({ error: "Imagem demasiado grande." }, 400);
    if (!looksLikeImage(full)) return c.json({ error: "Ficheiro não é imagem válida." }, 400);
    const thumb = thumbBase64 ? b64ToBytes(String(thumbBase64)) : full;
    if (thumbBase64 && !looksLikeImage(thumb)) return c.json({ error: "Thumb inválido." }, 400);

    const fileId = `r2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    await c.env.YESOLA_IMAGES.put(fullKey(fileId), full, {
      httpMetadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000, immutable" },
    });
    await c.env.YESOLA_IMAGES.put(thumbKey(fileId), thumb, {
      httpMetadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000, immutable" },
    });

    // Arquivo no Telegram best-effort (o admin vê as fotos no grupo; nunca
    // falha o upload por causa disto).
    try {
      await waitTelegramCooldown();
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append(
        "photo",
        new Blob([full as unknown as ArrayBuffer], { type: "image/jpeg" }),
        filename || "upload.jpg"
      );
      formData.append(
        "caption",
        `📸 Nova Imagem (GuiaLocal)\nFicheiro: ${filename || "upload.jpg"}\nData: ${new Date().toLocaleString("pt-PT")}`
      );
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: formData });
      const tgJson = (await tgRes.json()) as any;
      if (!tgJson.ok && tgJson?.error_code === 429) {
        const ra = Number(tgJson?.parameters?.retry_after) > 0 ? Number(tgJson.parameters.retry_after) : 30;
        telegramCooldownUntil = Date.now() + Math.min(ra, 300) * 1000;
      }
    } catch (e) {
      console.warn("Arquivo Telegram falhou (best-effort):", e);
    }

    const proxyUrl = `/api/media/image/${fileId}`;
    return c.json({ imageUrl: proxyUrl, thumbnailUrl: `${proxyUrl}?size=thumb` });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return c.json({ error: err.message || "Erro interno no upload." }, 500);
  }
});

async function fetchWithRetry(url: string, attempts = 4): Promise<Response> {
  await waitTelegramCooldown();
  let lastErr: unknown = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      if (res.status === 429) {
        const waitMs = (await readRetryAfter(res)) || 5000;
        telegramCooldownUntil = Date.now() + waitMs;
        lastErr = new Error(`Telegram 429 — retry_after ${Math.round(waitMs / 1000)}s`);
        console.warn(`⚠️ Telegram 429 em ${i}/${attempts}: a aguardar ${Math.round(waitMs / 1000)}s (cooldown global).`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      if (res.status >= 500 && res.status < 600) {
        lastErr = new Error(`Telegram ${res.status}`);
      } else {
        throw new Error(`Telegram ${res.status}`);
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("Telegram 429")) {
        lastErr = e;
        continue;
      }
      lastErr = e;
    }
    if (i < attempts) await new Promise((r) => setTimeout(r, 500 * i));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Falha ao contactar o Telegram");
}

function fetchVariants(fileId: string, token: string, env: Env): Promise<{ full: Uint8Array; thumb: Uint8Array } | null> {
  const existing = inflight.get(fileId);
  if (existing) return existing;
  const p = (async () => {
    const fileUrlRes = await fetchWithRetry(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
    const fileUrlResult = (await fileUrlRes.json()) as any;
    if (!fileUrlResult.ok) throw new Error("NOT_FOUND");
    const filePath = fileUrlResult.result.file_path;
    const imageRes = await fetchWithRetry(`https://api.telegram.org/file/bot${token}/${filePath}`);
    const buffer = new Uint8Array(await imageRes.arrayBuffer());
    if (buffer.length > 20 * 1024 * 1024) throw new Error("TOO_LARGE");
    if (!looksLikeImage(buffer)) throw new Error("BAD_IMAGE");
    // Sem sharp no edge: grava o original nas duas chaves (migração futura
    // pode regenerar thumbs reais; o CDN + cache tornam aceitável).
    await env.YESOLA_IMAGES.put(fullKey(fileId), buffer, {
      httpMetadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000, immutable" },
    });
    await env.YESOLA_IMAGES.put(thumbKey(fileId), buffer, {
      httpMetadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000, immutable" },
    });
    return { full: buffer, thumb: buffer };
  })();
  inflight.set(fileId, p);
  p.then(
    () => {
      if (inflight.get(fileId) === p) inflight.delete(fileId);
    },
    () => {
      if (inflight.get(fileId) === p) inflight.delete(fileId);
    }
  );
  return p;
}

// Endpoint para servir a imagem: R2 primeiro, Telegram em migração preguiçosa.
// ?size=thumb → versão leve para grelhas/cartões.
mediaRouter.get("/image/:fileId", async (c) => {
  try {
    const fileId = c.req.param("fileId");
    // fileIds do Telegram são base64url ([A-Za-z0-9-_]); ids R2 são r2-*.
    // Rejeitar o resto também bloqueia path traversal no R2.
    if (!isFileId(fileId)) return c.text("fileId inválido.", 400);
    const wantThumb = c.req.query("size") === "thumb";
    const token = c.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return c.text("Bot token não configurado.", 500);
    }

    const sendBuf = (buf: Uint8Array, obj?: { writeHttpMetadata: (h: Headers) => void } | null) => {
      const headers = new Headers();
      headers.set("Content-Type", "image/jpeg");
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      if (obj) {
        try {
          obj.writeHttpMetadata(headers);
        } catch {
          /* usa os nossos */
        }
      }
      return new Response(buf as unknown as BodyInit, { headers });
    };

    // 1. R2 → direto (caminho quente; o CDN faz o resto).
    const cached = await c.env.YESOLA_IMAGES.get(wantThumb ? thumbKey(fileId) : fullKey(fileId));
    if (cached) {
      const buf = new Uint8Array(await new Response(cached.body).arrayBuffer());
      return sendBuf(buf, cached);
    }

    // 2. Legado Telegram (primeiro acesso após migração): busca uma vez e
    //    grava no R2. Pedidos concorrentes partilham o mesmo fetch.
    try {
      const variants = await fetchVariants(fileId, token, c.env);
      if (!variants) throw new Error("NOT_FOUND");
      return sendBuf(wantThumb ? variants.thumb : variants.full);
    } catch (e: any) {
      if (e?.message === "NOT_FOUND") return c.text("Arquivo não encontrado no Telegram.", 404);
      throw e;
    }
  } catch (err) {
    console.error("Proxy image error:", err);
    return c.text("Erro ao carregar a imagem proxy", 500);
  }
});
