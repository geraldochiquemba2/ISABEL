import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./schema";
import { storesRouter } from "./routes/stores";
import { productsRouter } from "./routes/products";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { mediaRouter } from "./routes/media";
import { categoriesRouter } from "./routes/categories";
import { statsRouter } from "./routes/stats";
import { styleTipsRouter } from "./routes/style-tips";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Return JSON for malformed JSON body errors (catch body-parser errors)
app.use((err: any, req: any, res: any, next: any) => {
  if (!err) return next();

  // body-parser sets `type` to 'entity.parse.failed' for some parse errors
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && 'body' in err)) {
    console.warn('Malformed JSON body received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  return next(err);
});

// Global handlers to log uncaught exceptions/rejections without crashing silently
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error && error.message ? error.message : error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Rotas da API
app.use("/api/stores", storesRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/media", mediaRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/style-tips", styleTipsRouter);

const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// Endpoint para ping (evitar hibernação)
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

async function initWithRetry(retries = 5, delayMs = 3000): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      await initDB();
      console.log("✅ Base de dados inicializada com sucesso.");
      return;
    } catch (err: any) {
      console.warn(`⚠️  Tentativa ${i}/${retries} falhou: ${err?.message || err}`);
      if (i < retries) {
        console.log(`   A aguardar ${delayMs / 1000}s antes de tentar novamente...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  console.error("❌ Não foi possível ligar à base de dados após várias tentativas. O servidor continua a correr sem persistência.");
}

// Previne a hibernação no Render (pinga o próprio serviço a cada 14 min se a variável RENDER_EXTERNAL_URL existir)
function startKeepAlive() {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    console.log(`⏱️  Configurado keep-alive para ${renderUrl}/api/ping a cada 14 minutos.`);
    setInterval(async () => {
      try {
        await fetch(`${renderUrl}/api/ping`);
        console.log(`⏱️  Keep-alive ping enviado com sucesso para ${renderUrl}/api/ping`);
      } catch (err: any) {
        console.error(`⚠️  Erro ao enviar keep-alive ping: ${err?.message || err}`);
      }
    }, 14 * 60 * 1000); // 14 minutos
  }
}

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  // Servir o frontend estático
  const distPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(distPath));

  // Qualquer outra rota que não seja /api/... vai para o index.html (SPA)
  // No Express 5, o wildcard '*' não é suportado da mesma forma, usamos Regex
  app.get(/.*/, (req, res) => {
    if (!req.path.startsWith("/api/")) {
      res.sendFile(path.resolve(distPath, "index.html"));
    } else {
      res.status(404).json({ message: "API route not found" });
    }
  });

  // Inicia o servidor imediatamente (não bloqueia na BD)
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    startKeepAlive();
  });

  // Inicializa a BD em segundo plano com retries
  initWithRetry();
}

start();

