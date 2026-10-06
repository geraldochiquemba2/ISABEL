import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import { initDB } from "./schema";
import { storesRouter } from "./routes/stores";
import { productsRouter } from "./routes/products";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { mediaRouter } from "./routes/media";
import { categoriesRouter } from "./routes/categories";
import { statsRouter } from "./routes/stats";
import { styleTipsRouter } from "./routes/style-tips";
import { weddingGroupsRouter } from "./routes/wedding-groups";
import { weddingsPageContentRouter } from "./routes/weddings-page-content";
import { placesRouter } from "./routes/places";
import { pushRouter } from "./routes/push";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
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

// Corta-banda: o bundle tem 2.5 MB e saía inteiro sem compressão. Gzip nativo
// (sem deps novas) para JSON/texto > 1 KB. Imagens/vídeos passam ao lado
// (já comprimidos). Colocado antes de tudo para apanhar também o cache.
import zlib from "zlib";
app.use((req: any, res: any, next: any) => {
  const origSend = res.send.bind(res);
  res.send = ((body: any) => {
    try {
      const ae = String(req.headers["accept-encoding"] || "");
      const ct = String(res.getHeader("Content-Type") || "");
      const buf = Buffer.isBuffer(body) ? body : typeof body === "string" ? Buffer.from(body) : null;
      const okType = /json|text|javascript|xml|svg/i.test(ct) && !/image|video|audio|zip|octet-stream/i.test(ct);
      if (
        buf && buf.length > 1024 && buf.length < 8 * 1024 * 1024 &&
        (req.method === "GET" || req.method === "POST") &&
        !res.getHeader("Content-Encoding") && ae.includes("gzip") && okType
      ) {
        const gz = zlib.gzipSync(buf);
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Vary", "Accept-Encoding");
        res.setHeader("Content-Length", String(gz.length));
        return origSend(gz);
      }
    } catch { /* cai no envio normal */ }
    return origSend(body);
  }) as any;
  next();
});

// Global handlers to log uncaught exceptions/rejections without crashing silently
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error && error.message ? error.message : error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Corta-banda urgente: cache em memória das listas públicas. Bots e crawlers
// pedem /api/products e /api/stores em rajada; sem isto cada hit ia à BD e
// gerava JSON completo à conta da banda. 30s + invalidação nas escritas:
// o dono edita e a lista atualiza logo a seguir.
const LIST_CACHE_TTL = 30 * 1000;
const listCache = new Map<string, { status: number; body: unknown; ts: number; headers: Record<string, string> }>();
function listCacheKey(req: any): string {
  return `${req.path}?${new URLSearchParams(req.query as any).toString()}`;
}
function sweepListCache(prefix: string): void {
  for (const k of listCache.keys()) {
    if (k.startsWith(prefix)) listCache.delete(k);
  }
  if (listCache.size > 500) {
    const drop = listCache.size - 500;
    let i = 0;
    for (const k of listCache.keys()) {
      if (i++ >= drop) break;
      listCache.delete(k);
    }
  }
}
app.use("/api/products", (req: any, res: any, next: any) => {
  if (req.method !== "GET" || req.headers.authorization || String(req.originalUrl || "").includes("/admin/")) {
    if (req.method !== "GET") sweepListCache("/api/products");
    return next();
  }
  const key = "/api/products" + listCacheKey(req);
  const hit = listCache.get(key);
  if (hit && Date.now() - hit.ts < LIST_CACHE_TTL) {
    res.setHeader("Cache-Control", "public, max-age=30");
    for (const [hk, hv] of Object.entries(hit.headers)) res.setHeader(hk, hv);
    return res.status(hit.status).json(hit.body);
  }
  const origJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    if (res.statusCode === 200) listCache.set(key, { status: 200, body, ts: Date.now(), headers: { "X-Total-Count": String(res.getHeader("X-Total-Count") ?? ""), "X-Page": String(res.getHeader("X-Page") ?? ""), "X-Limit": String(res.getHeader("X-Limit") ?? "") } });
    res.setHeader("Cache-Control", "public, max-age=30");
    return origJson(body);
  }) as any;
  next();
});
app.use("/api/stores", (req: any, res: any, next: any) => {
  if (req.method !== "GET" || req.headers.authorization || String(req.originalUrl || "").includes("/admin/")) {
    if (req.method !== "GET") sweepListCache("/api/stores");
    return next();
  }
  const key = "/api/stores" + listCacheKey(req);
  const hit = listCache.get(key);
  if (hit && Date.now() - hit.ts < LIST_CACHE_TTL) {
    res.setHeader("Cache-Control", "public, max-age=30");
    for (const [hk, hv] of Object.entries(hit.headers)) res.setHeader(hk, hv);
    return res.status(hit.status).json(hit.body);
  }
  const origJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    if (res.statusCode === 200) listCache.set(key, { status: 200, body, ts: Date.now(), headers: { "X-Total-Count": String(res.getHeader("X-Total-Count") ?? ""), "X-Page": String(res.getHeader("X-Page") ?? ""), "X-Limit": String(res.getHeader("X-Limit") ?? "") } });
    res.setHeader("Cache-Control", "public, max-age=30");
    return origJson(body);
  }) as any;
  next();
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
app.use("/api/wedding-groups", weddingGroupsRouter);
app.use("/api/weddings-page-content", weddingsPageContentRouter);
app.use("/api/places", placesRouter);
app.use("/api/push", pushRouter);

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

// Verificar assinaturas vencidas a cada 1 hora e suspender automaticamente
function startSubscriptionCheck() {
  async function checkExpired() {
    try {
      const now = new Date();
      const result = await pool.query(
        `UPDATE users SET status = 'SUSPENSO', status_reason = 'Assinatura vencida — renovação pendente',
         subscription_status = 'VENCIDO'
         WHERE status = 'APROVADO'
         AND subscription_expires_at IS NOT NULL
         AND subscription_expires_at < $1
         AND phone != '999999999'
         RETURNING id, name, phone`,
        [now]
      );
      if (result.rowCount && result.rowCount > 0) {
        console.log(`⚠️  ${result.rowCount} conta(s) suspensa(s) por assinatura vencida.`);
      }
    } catch (err: any) {
      console.error("Erro ao verificar assinaturas vencidas:", err?.message);
    }
  }

  // Verificar imediatamente ao iniciar
  checkExpired();
  // Depois a cada 1 hora
  setInterval(checkExpired, 60 * 60 * 1000);
}

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  // Servir o frontend estático. Os assets do Vite têm hash no nome → cache
  // imutável de 1 ano (corta-banda em visitas repetidas). O index.html fica
  // de fora (index: false) e sai pelo fallback abaixo sem cache.
  const distPath = path.resolve(__dirname, "../dist/public");
  // Pré-comprime os assets de texto (o bundle tem 2.5 MB e o express.static
  // não comprime sozinho). Guarda em RAM uma vez no arranque (~0.8 MB).
  const gzCache = new Map<string, Buffer>();
  try {
    const walk = (dir: string): void => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) { walk(p); continue; }
        if (!/\.(js|css|html|json|map|txt|xml|svg)$/i.test(e.name)) continue;
        try { gzCache.set(p, zlib.gzipSync(fs.readFileSync(p))); } catch { /* ignora */ }
      }
    };
    if (fs.existsSync(distPath)) walk(distPath);
  } catch { /* sem dist (dev), segue sem pré-compressão */ }
  const GZ_TYPES: Record<string, string> = {
    ".js": "application/javascript", ".css": "text/css", ".html": "text/html",
    ".json": "application/json", ".map": "application/json", ".txt": "text/plain",
    ".xml": "application/xml", ".svg": "image/svg+xml",
  };
  app.use((req: any, res: any, next: any) => {
    if (req.method !== "GET") return next();
    if (!String(req.headers["accept-encoding"] || "").includes("gzip")) return next();
    let file = "";
    try { file = path.normalize(path.join(distPath, decodeURIComponent(req.path))); } catch { return next(); }
    if (!file.startsWith(distPath)) return next();
    const gz = gzCache.get(file);
    if (!gz) return next();
    res.setHeader("Content-Type", GZ_TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Length", String(gz.length));
    return res.send(gz);
  });
  app.use(express.static(distPath, { maxAge: "1y", immutable: true, index: false }));

  // Qualquer outra rota que não seja /api/... vai para o index.html (SPA)
  // No Express 5, o wildcard '*' não é suportado da mesma forma, usamos Regex
  app.get(/.*/, (req, res) => {
    if (!req.path.startsWith("/api/")) {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.resolve(distPath, "index.html"));
    } else {
      res.status(404).json({ message: "API route not found" });
    }
  });

  // Inicia o servidor imediatamente (não bloqueia na BD)
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    startKeepAlive();
    startSubscriptionCheck();
  });

  // Inicializa a BD em segundo plano com retries
  initWithRetry();
}

start();

