import { Router } from "express";
import { pool } from "../db";

export const mediaRouter = Router();

// Endpoint helper para carregar imagem via Telegram Bot API
mediaRouter.post("/upload", async (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Nenhuma imagem em base64 foi enviada." });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ error: "Configuração do Telegram incompleta no servidor." });
    }

    // Converter base64 para Buffer
    const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

    // Criar FormData para enviar ao Telegram API
    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("chat_id", chatId);
    formData.append("photo", blob, filename || "upload.jpg");
    
    // Adicionar uma legenda (caption) para ficar organizado no Telegram do admin
    const captionText = `📸 Nova Imagem (GuiaLocal)\nFicheiro: ${filename || "upload.jpg"}\nData: ${new Date().toLocaleString("pt-PT")}`;
    formData.append("caption", captionText);

    // Enviar para o Telegram
    const telegramUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!result.ok) {
      console.error("Erro do Telegram:", result);
      return res.status(500).json({ error: `Erro do Telegram: ${result.description}` });
    }

    // Obter o file_id do tamanho maior
    const photos = result.result.photo;
    const largestPhoto = photos[photos.length - 1];
    const fileId = largestPhoto.file_id;

    // Retorna uma rota do nosso próprio servidor em vez da URL do Telegram.
    // Assim não expomos o TELEGRAM_BOT_TOKEN e evitamos o problema de expiração de 1 hora do file_path.
    const proxyUrl = `/api/media/image/${fileId}`;
    res.json({ imageUrl: proxyUrl, thumbnailUrl: `${proxyUrl}?size=thumb` });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message || "Erro interno no upload para o Telegram." });
  }
});

import fs from "fs";
import path from "path";

// Cria a diretoria de cache se não existir
const CACHE_DIR = path.join(process.cwd(), "cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Corta-banda: as fotos de telemóvel (2–5 MB) passavam inteiras pelo Render
// em cada visualização. Com sharp (opcional) gravamos duas versões:
// - cheia: máx 1600px, JPEG q72 (suficiente para capa/galeria)
// - thumb: máx 480px, JPEG q60 (grelhas e cartões)
// Sem sharp, serve o original (comportamento antigo).
let sharpLoader: Promise<any> | null = null;
function loadSharp(): Promise<any> {
  if (!sharpLoader) {
    sharpLoader = import("sharp").then((m: any) => m.default || m).catch(() => null);
  }
  return sharpLoader;
}

async function compressVariants(input: Buffer): Promise<{ full: Buffer; thumb: Buffer }> {
  const sharp = await loadSharp();
  if (!sharp) return { full: input, thumb: input };
  try {
    const full = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true }).toBuffer();
    const thumb = await sharp(input).rotate().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
    return { full, thumb };
  } catch {
    return { full: input, thumb: input };
  }
}

const fullCachePath = (fileId: string) => path.join(CACHE_DIR, `${fileId}.jpg`);
const thumbCachePath = (fileId: string) => path.join(CACHE_DIR, `${fileId}.thumb.jpg`);

// Validação mínima de imagem (magic bytes). Ficheiros parciais/vazios ou
// respostas de erro gravadas por engano chumbam aqui e nunca entram no cache.
function looksLikeImage(buf: Buffer): boolean {
  if (!buf || buf.length < 64) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true; // PNG
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true; // GIF
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return true; // WEBP
  return false;
}

// Lê do cache só se for imagem válida; ficheiro corrupto é apagado para se
// regenerar a seguir (auto-cura sem precisar de restart).
function readValidCache(p: string): Buffer | null {
  try {
    if (!fs.existsSync(p)) return null;
    const buf = fs.readFileSync(p);
    if (!looksLikeImage(buf)) {
      try { fs.unlinkSync(p); } catch { /* ignora */ }
      return null;
    }
    return buf;
  } catch {
    return null;
  }
}

// Escrita atómica (tmp + rename): leitores nunca apanham ficheiro a meio.
function writeAtomic(p: string, buf: Buffer): void {
  const tmp = `${p}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, p);
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        lastErr = new Error(`Telegram ${res.status}`); // transitório → repete
      } else {
        throw new Error(`Telegram ${res.status}`); // 4xx → definitivo
      }
    } catch (e) {
      lastErr = e;
    }
    if (i < attempts) await new Promise((r) => setTimeout(r, 500 * i));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Falha ao contactar o Telegram");
}

// Deduplica fetches concorrentes do mesmo fileId: N pedidos simultâneos
// partilham 1 só ida ao Telegram em vez de N (era isto que corrompia o cache).
const inflight = new Map<string, Promise<{ full: Buffer; thumb: Buffer }>>();

// Semáforo anti-OOM: as páginas disparam dezenas de /api/media/image de uma
// vez e cada um segura buffer do download + 2 buffers do sharp em RAM.
// Máx 4 processamentos simultâneos; o resto espera em fila.
let mediaSlots = 4;
const mediaQueue: Array<() => void> = [];
async function withMediaSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (mediaSlots <= 0) await new Promise<void>((res) => mediaQueue.push(res));
  mediaSlots--;
  try {
    return await fn();
  } finally {
    mediaSlots++;
    const next = mediaQueue.shift();
    if (next) next();
  }
}
function fetchVariants(fileId: string, token: string): Promise<{ full: Buffer; thumb: Buffer }> {
  const existing = inflight.get(fileId);
  if (existing) return existing;
  const p = (async () => {
    return withMediaSlot(async () => {
      const fileUrlRes = await fetchWithRetry(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
      const fileUrlResult = await fileUrlRes.json();
      if (!fileUrlResult.ok) throw new Error("NOT_FOUND");
      const filePath = fileUrlResult.result.file_path;
      const imageRes = await fetchWithRetry(`https://api.telegram.org/file/bot${token}/${filePath}`);
      const buffer = Buffer.from(await imageRes.arrayBuffer());
      if (buffer.length > 20 * 1024 * 1024) throw new Error("TOO_LARGE");
      if (!looksLikeImage(buffer)) throw new Error("BAD_IMAGE");
      const { full, thumb } = await compressVariants(buffer);
      if (!looksLikeImage(full) || !looksLikeImage(thumb)) throw new Error("BAD_IMAGE");
      writeAtomic(fullCachePath(fileId), full);
      writeAtomic(thumbCachePath(fileId), thumb);
      return { full, thumb };
    });
  })();
  inflight.set(fileId, p);
  p.then(
    () => { if (inflight.get(fileId) === p) inflight.delete(fileId); },
    () => { if (inflight.get(fileId) === p) inflight.delete(fileId); }
  );
  return p;
}

// Thumbs para grelhas/cartões: na primeira visita (cache frio após sleep ou
// deploy) cada imagem pagava download + sharp 1600px + sharp 480px, e era
// isso que entupia a fila de 4 e fazia os cards demorar. Aqui gera-se SÓ o
// thumb; a cheia fica para quando a página de detalhe a pedir.
const inflightThumb = new Map<string, Promise<Buffer>>();
function fetchThumbOnly(fileId: string, token: string): Promise<Buffer> {
  const existing = inflightThumb.get(fileId);
  if (existing) return existing;
  const p = (async () => {
    return withMediaSlot(async () => {
      const fileUrlRes = await fetchWithRetry(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
      const fileUrlResult = await fileUrlRes.json();
      if (!fileUrlResult.ok) throw new Error("NOT_FOUND");
      const filePath = fileUrlResult.result.file_path;
      const imageRes = await fetchWithRetry(`https://api.telegram.org/file/bot${token}/${filePath}`);
      const buffer = Buffer.from(await imageRes.arrayBuffer());
      if (buffer.length > 20 * 1024 * 1024) throw new Error("TOO_LARGE");
      if (!looksLikeImage(buffer)) throw new Error("BAD_IMAGE");
      const sharp = await loadSharp();
      let thumb: Buffer;
      if (sharp) {
        try {
          thumb = await sharp(buffer).rotate().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 60, mozjpeg: true }).toBuffer();
        } catch {
          thumb = buffer;
        }
      } else {
        thumb = buffer;
      }
      if (!looksLikeImage(thumb)) throw new Error("BAD_IMAGE");
      writeAtomic(thumbCachePath(fileId), thumb);
      return thumb;
    });
  })();
  inflightThumb.set(fileId, p);
  p.then(
    () => { if (inflightThumb.get(fileId) === p) inflightThumb.delete(fileId); },
    () => { if (inflightThumb.get(fileId) === p) inflightThumb.delete(fileId); }
  );
  return p;
}

// Endpoint para servir a imagem proxyando pelo Telegram
// ?size=thumb → versão leve para grelhas/cartões (poupa ~80–90% por imagem)
mediaRouter.get("/image/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    // fileIds do Telegram são base64url ([A-Za-z0-9-_]); rejeitar o resto
    // também bloqueia path traversal no CACHE_DIR.
    if (!/^[\w-]{5,200}$/.test(fileId)) return res.status(400).send("fileId inválido.");
    const wantThumb = String(req.query.size || "") === "thumb";
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(500).send("Bot token não configurado.");
    }

    const sendBuf = (buf: Buffer) => {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // 1 ano (só chega aqui imagem validada)
      res.setHeader("Content-Length", String(buf.length));
      return res.send(buf);
    };

    // 1. Cache válido → direto da memória (sem condição de corrida com
    //    escritas, que agora são atómicas).
    const cached = readValidCache(wantThumb ? thumbCachePath(fileId) : fullCachePath(fileId));
    if (cached) return sendBuf(cached);

    // 2. Thumb pedida mas só a cheia existe e é válida → deriva da cheia
    //    sem ir ao Telegram.
    if (wantThumb) {
      const fullBuf = readValidCache(fullCachePath(fileId));
      if (fullBuf) {
        const { thumb } = await withMediaSlot(() => compressVariants(fullBuf));
        if (looksLikeImage(thumb)) {
          try { writeAtomic(thumbCachePath(fileId), thumb); } catch { /* serve na mesma */ }
          return sendBuf(thumb);
        }
      }
    }

    // 3. Vai ao Telegram (pedidos concorrentes partilham o mesmo fetch,
    //    com retry em 429/5xx). Só entra no cache o que for imagem válida.
    //    Thumbs geram SÓ o thumb (metade do CPU na primeira visita).
    try {
      if (wantThumb) {
        const only = await fetchThumbOnly(fileId, token);
        return sendBuf(only);
      }
      const { full } = await fetchVariants(fileId, token);
      return sendBuf(full);
    } catch (e: any) {
      if (e?.message === "NOT_FOUND") return res.status(404).send("Arquivo não encontrado no Telegram.");
      throw e;
    }
  } catch (err) {
    console.error("Proxy image error:", err);
    res.status(500).send("Erro ao carregar a imagem proxy");
  }
});
