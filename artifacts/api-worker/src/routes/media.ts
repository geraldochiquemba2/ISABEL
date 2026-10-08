import { Hono } from "hono";
import type { Env } from "../env";

export const mediaRouter = new Hono<{ Bindings: Env }>();

// Storage de imagens no Workers SEM R2 (R2 exige cartão): Telegram como
// arquivo + Cache API do edge como cache (grátis, sem billing).
// Chaves de cache: `img:full:<fileId>` / `img:thumb:<fileId>`.
// - Uploads novos: vão ao Telegram (sendPhoto) e semeiam o cache com cheia +
//   thumb 480px que o cliente envia (ver @/lib/api uploadImage).
// - Legado: no primeiro GET sem cache, busca ao Telegram UMA vez e semeia;
//   daí em diante serve do edge (+ CDN à frente).
// - URLs mantidas: `/api/media/image/<fileId>[?size=thumb]` (zero mudanças
//   no frontend para leitura).

declare const caches: {
  default: {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
  };
};

const cacheKey = (kind: "full" | "thumb", fileId: string) =>
  new Request(`https://isabel-api.local/img/${kind}/${fileId}`, { method: "GET" });

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

function imgResponse(buf: Uint8Array): Response {
  const headers = new Headers();
  headers.set("Content-Type", "image/jpeg");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(buf as unknown as BodyInit, { headers });
}

// Deduplica fetches concorrentes do mesmo fileId ao Telegram.
const inflight = new Map<string, Promise<Uint8Array | null>>();

// Endpoint helper para carregar imagem via Telegram Bot API
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

    await waitTelegramCooldown();
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", new Blob([full as unknown as ArrayBuffer], { type: "image/jpeg" }), filename || "upload.jpg");
    // Legenda para ficar organizado no Telegram do admin
    formData.append(
      "caption",
      `📸 Nova Imagem (GuiaLocal)\nFicheiro: ${filename || "upload.jpg"}\nData: ${new Date().toLocaleString("pt-PT")}`
    );

    // Enviar para o Telegram
    const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: formData });
    const result = (await response.json()) as any;
    if (!result.ok) {
      if (result?.error_code === 429) {
        const waitMs = Math.min(Number(result?.parameters?.retry_after) > 0 ? Number(result.parameters.retry_after) : 30, 300) * 1000;
        telegramCooldownUntil = Date.now() + waitMs;
        console.warn(`⚠️ Telegram 429 no upload: cooldown global de ${Math.round(waitMs / 1000)}s.`);
        return c.json({ error: `Telegram ocupado, tente de novo em ${Math.round(waitMs / 1000)} segundos.` }, 429);
      }
      console.error("Erro do Telegram:", result);
      return c.json({ error: `Erro do Telegram: ${result.description}` }, 500);
    }

    // Obter o file_id do tamanho maior
    const photos = result.result.photo;
    const largestPhoto = photos[photos.length - 1];
    const fileId = largestPhoto.file_id;

    // Semear o edge cache com cheia + thumb (upload já traz as duas).
    try {
      const thumb = thumbBase64 ? b64ToBytes(String(thumbBase64)) : full;
      if (!thumbBase64 || looksLikeImage(thumb)) {
        await caches.default.put(cacheKey("full", fileId), imgResponse(full));
        await caches.default.put(cacheKey("thumb", fileId), imgResponse(thumbBase64 ? thumb : full));
      }
    } catch {
      /* cache best-effort */
    }

    // Mesmas URLs de sempre (proxy) — o GET resolve via cache/Telegram.
    const proxyUrl = `/api/media/image/${fileId}`;
    return c.json({ imageUrl: proxyUrl, thumbnailUrl: `${proxyUrl}?size=thumb` });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return c.json({ error: err.message || "Erro interno no upload." }, 500);
  }
});

async function fetchFromTelegram(fileId: string, token: string): Promise<Uint8Array> {
  const fileUrlRes = await fetchWithRetry(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
  const fileUrlResult = (await fileUrlRes.json()) as any;
  if (!fileUrlResult.ok) throw new Error("NOT_FOUND");
  const filePath = fileUrlResult.result.file_path;
  const imageRes = await fetchWithRetry(`https://api.telegram.org/file/bot${token}/${filePath}`);
  const buffer = new Uint8Array(await imageRes.arrayBuffer());
  if (buffer.length > 20 * 1024 * 1024) throw new Error("TOO_LARGE");
  if (!looksLikeImage(buffer)) throw new Error("BAD_IMAGE");
  return buffer;
}

function fetchVariants(fileId: string, token: string): Promise<Uint8Array | null> {
  const existing = inflight.get(fileId);
  if (existing) return existing;
  const p = (async () => {
    const buffer = await fetchFromTelegram(fileId, token);
    // Sem sharp no edge: thumb = original nesta primeira passagem; uploads
    // novos já trazem thumb real e semeiam o cache (ver POST acima).
    try {
      await caches.default.put(cacheKey("full", fileId), imgResponse(buffer));
      await caches.default.put(cacheKey("thumb", fileId), imgResponse(buffer));
    } catch {
      /* cache best-effort */
    }
    return buffer;
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

// Endpoint para servir a imagem: edge cache primeiro, Telegram em fallback.
// ?size=thumb → versão leve para grelhas/cartões.
mediaRouter.get("/image/:fileId", async (c) => {
  try {
    const fileId = c.req.param("fileId");
    // fileIds do Telegram são base64url ([A-Za-z0-9-_]); ids R2 são r2-*.
    // Rejeitar o resto também bloqueia traversal nas chaves de cache.
    if (!isFileId(fileId)) return c.text("fileId inválido.", 400);
    const wantThumb = c.req.query("size") === "thumb";
    const token = c.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return c.text("Bot token não configurado.", 500);
    }

    // 1. Edge cache → direto.
    const cached = await caches.default.match(cacheKey(wantThumb ? "thumb" : "full", fileId));
    if (cached) return cached;

    // 2. Telegram (pedidos concorrentes partilham o mesmo fetch,
    //    com retry em 429/5xx). Só entra imagem válida no cache.
    try {
      const buffer = await fetchVariants(fileId, token);
      if (!buffer) throw new Error("NOT_FOUND");
      return imgResponse(buffer);
    } catch (e: any) {
      if (e?.message === "NOT_FOUND") return c.text("Arquivo não encontrado no Telegram.", 404);
      throw e;
    }
  } catch (err) {
    console.error("Proxy image error:", err);
    return c.text("Erro ao carregar a imagem proxy", 500);
  }
});
