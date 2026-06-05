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
    res.json({ imageUrl: proxyUrl });
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

// Endpoint para servir a imagem proxyando pelo Telegram
mediaRouter.get("/image/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(500).send("Bot token não configurado.");
    }

    const cachedFilePath = path.join(CACHE_DIR, `${fileId}.jpg`);

    // Se já estiver em cache, devolve imediatamente do disco
    if (fs.existsSync(cachedFilePath)) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache longo (1 ano)
      return res.sendFile(cachedFilePath);
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

    // 3. Guarda em cache no disco e devolve ao cliente
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Grava no disco de forma síncrona/assíncrona simples
    fs.writeFileSync(cachedFilePath, buffer);

    res.setHeader("Content-Type", imageRes.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache longo
    res.send(buffer);
  } catch (err) {
    console.error("Proxy image error:", err);
    res.status(500).send("Erro ao carregar a imagem proxy");
  }
});
