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
// Atrás do proxy do Render (e da Cloudflare): sem isto o req.ip seria o IP
// do proxy e o rate limit abaixo contava toda a gente como um só cliente.
app.set("trust proxy", 1);
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
        buf && buf.length > 1024 && buf.length < 2 * 1024 * 1024 &&
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

// Travão de emergência anti-bots: rajadas (scrapers a sacar o catálogo) são
// o que está a comer a quota. Humanos fazem dezenas de pedidos/min; bots,
// centenas. 600/min por IP com janela deslizante de 60s + 429 com Retry-After
// (os bots decentes recuam; o Google não é penalizado por 429 ocasional).
// O /api/ping (keep-alive) nunca é limitado.
const RATE_WINDOW = 60 * 1000;
const RATE_MAX = 600;
const rateHits = new Map<string, number[]>();
app.use("/api/", (req: any, res: any, next: any) => {
  if (req.path === "/ping" || req.method === "OPTIONS") return next();
  const ip = String(req.ip || req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  let arr = rateHits.get(ip);
  if (!arr) { arr = []; rateHits.set(ip, arr); }
  while (arr.length && arr[0] <= now - RATE_WINDOW) arr.shift();
  if (arr.length >= RATE_MAX) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Muitos pedidos, tente de novo em 1 minuto" });
  }
  arr.push(now);
  if (rateHits.size > 2000) {
    const first = rateHits.keys().next();
    if (!first.done) rateHits.delete(first.value);
  }
  next();
});

// Higiene periódica anti-OOM: IPs que nunca mais voltam ficavam no Map para
// sempre (era o que enchia a RAM no plano free de 512 MB). A cada 5 min
// remove janelas expiradas e corta o Map para 2000 IPs.
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of rateHits) {
    while (arr.length && arr[0] <= now - RATE_WINDOW) arr.shift();
    if (!arr.length) rateHits.delete(ip);
  }
  while (rateHits.size > 2000) {
    const first = rateHits.keys().next();
    if (first.done) break;
    rateHits.delete(first.value);
  }
}, 5 * 60 * 1000);

// NOTA: sem cache em memória nas listas públicas (/api/stores, /api/products).
// Por decisão do negócio, vão sempre fresquinhas à BD (imagens e dados
// atualizam logo após editar). O rate limit acima continua a travar rajadas.

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
// Toca na BD (SELECT 1) para manter o Neon acordado também — o ping
// anterior só respondia "pong" sem query, por isso a BD continuava
// a hibernar aos 5 min mesmo com o self-ping ativo. Se a BD estiver
// a dormir/falhar, responde 200 na mesma (o Render só precisa disso).
app.get("/api/ping", async (req, res) => {
  try {
    await pool.query("SELECT 1");
  } catch { /* ignora: serviço continua saudável para o Render */ }
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

// Previne a hibernação no Render (pinga o próprio serviço a cada 10 min).
// Resolve o URL público via RENDER_EXTERNAL_URL (preferida) ou
// RENDER_EXTERNAL_HOSTNAME (injetada pelo Render em runtime, sem esquema).
// NOTA: no render.yaml esta var tem de ter valor — com `sync: false` e sem
// valor ela ficava vazia e este bloco nunca arrancava (sem a linha
// "Configurado keep-alive" nos logs). Agora há aviso explícito se faltar.
function startKeepAlive() {
  const raw = (process.env.RENDER_EXTERNAL_URL || process.env.RENDER_EXTERNAL_HOSTNAME || "").trim();
  if (!raw) {
    console.warn("⚠️  RENDER_EXTERNAL_URL não definida — self-ping anti-sleep DESATIVADO. Define-a no Render (Environment) ou usa ping externo (ex: UptimeRobot → /api/ping).");
    return;
  }
  const base = raw.startsWith("http") ? raw.replace(/\/+$/, "") : `https://${raw.replace(/\/+$/, "")}`;
  console.log(`⏱️  Configurado keep-alive para ${base}/api/ping a cada 10 minutos.`);
  setInterval(async () => {
    try {
      await fetch(`${base}/api/ping`);
      console.log(`⏱️  Keep-alive ping enviado com sucesso para ${base}/api/ping`);
    } catch (err: any) {
      console.error(`⚠️  Erro ao enviar keep-alive ping: ${err?.message || err}`);
    }
  }, 10 * 60 * 1000); // 10 minutos (margem antes dos 15 min do plano free)
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

