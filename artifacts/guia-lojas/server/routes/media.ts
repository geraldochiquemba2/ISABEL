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

// Endpoint para servir a imagem proxyando pelo Telegram
// ?size=thumb → versão leve para grelhas/cartões (poupa ~80–90% por imagem)
mediaRouter.get("/image/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const wantThumb = String(req.query.size || "") === "thumb";
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(500).send("Bot token não configurado.");
    }

    const cachedFilePath = path.join(CACHE_DIR, `${fileId}.jpg`);
    const cachedThumbPath = path.join(CACHE_DIR, `${fileId}.thumb.jpg`);

    const serveFile = (p: string) => {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // 1 ano
      return res.sendFile(p);
    };

    // Thumb pedida e já existe → direto do disco
    if (wantThumb && fs.existsSync(cachedThumbPath)) return serveFile(cachedThumbPath);
    // Cheia pedida e já existe → direto do disco
    if (!wantThumb && fs.existsSync(cachedFilePath)) return serveFile(cachedFilePath);
    // Thumb pedida mas só a cheia existe → deriva a thumb da cheia (sem ir ao Telegram)
    if (wantThumb && fs.existsSync(cachedFilePath)) {
      const { thumb } = await compressVariants(fs.readFileSync(cachedFilePath));
      fs.writeFileSync(cachedThumbPath, thumb);
      return serveFile(cachedThumbPath);
    }

    // 1. Pede um file_path fresco (que dura apenas 1 hora na API do Telegram)
    const fileUrlRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
    const fileUrlResult = await fileUrlRes.json();

    if (!fileUrlResult.ok) {
      return res.status(404).send("Arquivo não encontrado no Telegram.");
    }

    const filePath = fileUrlResult.result.file_path;
    const finalImageUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    // 2. Faz o fetch da imagem real
    const imageRes = await fetch(finalImageUrl);
    if (!imageRes.ok) {
      throw new Error("Falha ao transferir imagem do Telegram");
    }

    // 3. Comprime (cheia + thumb), guarda em cache no disco e devolve ao cliente
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { full, thumb } = await compressVariants(buffer);

    // Grava no disco de forma síncrona/assíncrona simples
    fs.writeFileSync(cachedFilePath, full);
    fs.writeFileSync(cachedThumbPath, thumb);

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // Cache longo
    res.send(wantThumb ? thumb : full);
  } catch (err) {
    console.error("Proxy image error:", err);
    res.status(500).send("Erro ao carregar a imagem proxy");
  }
});
