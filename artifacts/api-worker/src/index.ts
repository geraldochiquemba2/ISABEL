// isabel-api — Cloudflare Worker (Hono). Substitui server/index.ts (Node).
// Sem: express.json 15mb (limite do plano Worker aplica-se), gzip manual
// (automático), static (Pages), keep-alive (sem sleep), sharp (ver media.ts),
// disco (R2), pg TCP (driver HTTP Neon).
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { db } from "./db";
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
import { moderationRouter } from "./routes/moderation";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors());

// Travão anti-bots best-effort (memória por isolate; o essencial é o 429 do
// Telegram com cooldown na media.ts). 600/min por IP, /api/ping isento.
const RATE_WINDOW = 60_000;
const RATE_MAX = 600;
const rateHits = new Map<string, number[]>();
app.use("/api/*", async (c, next) => {
  if (c.req.path === "/api/ping" || c.req.method === "OPTIONS") return next();
  const ip =
    c.req.header("cf-connecting-ip") ||
    (c.req.header("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  let arr = rateHits.get(ip);
  if (!arr) {
    arr = [];
    rateHits.set(ip, arr);
  }
  while (arr.length && arr[0] <= now - RATE_WINDOW) arr.shift();
  if (arr.length >= RATE_MAX) {
    c.header("Retry-After", "60");
    return c.json({ error: "Muitos pedidos, tente de novo em 1 minuto" }, 429);
  }
  arr.push(now);
  if (rateHits.size > 2000) {
    const first = rateHits.keys().next();
    if (!first.done) rateHits.delete(first.value);
  }
  await next();
});

// /api/ping — healthcheck (com SELECT 1 para manter o Neon acordado).
app.get("/api/ping", async (c) => {
  try {
    await db(c.env).query("SELECT 1");
  } catch {
    /* ignora: worker continua saudável */
  }
  return c.text("pong");
});

app.route("/api/stores", storesRouter);
app.route("/api/products", productsRouter);
app.route("/api/auth", authRouter);
app.route("/api/admin", adminRouter);
app.route("/api/media", mediaRouter);
app.route("/api/categories", categoriesRouter);
app.route("/api/stats", statsRouter);
app.route("/api/style-tips", styleTipsRouter);
app.route("/api/wedding-groups", weddingGroupsRouter);
app.route("/api/weddings-page-content", weddingsPageContentRouter);
app.route("/api/places", placesRouter);
app.route("/api/push", pushRouter);
app.route("/api/moderation", moderationRouter);

app.notFound((c) =>
  c.req.path.startsWith("/api/")
    ? c.json({ message: "API route not found" }, 404)
    : c.text("Not Found", 404)
);

// Cron horária (wrangler [triggers]): contas com assinatura vencida.
async function checkExpired(env: Env) {
  try {
    const rows = (await db(env).query(
      `UPDATE users SET status = 'SUSPENSO', status_reason = 'Assinatura vencida — renovação pendente',
       subscription_status = 'VENCIDO'
       WHERE status = 'APROVADO'
       AND subscription_expires_at IS NOT NULL
       AND subscription_expires_at < NOW()
       AND phone != '999999999'
       RETURNING id`
    )) as unknown[];
    if (rows.length > 0) console.log(`⚠️ ${rows.length} conta(s) suspensa(s) por assinatura vencida.`);
  } catch (err) {
    console.error("Erro ao verificar assinaturas vencidas:", err);
  }
}

export default {
  fetch: app.fetch,
  async scheduled(event: { cron: string }, env: Env) {
    // Keep-alive (30min): só SELECT 1 para o Neon não hiberar tanto.
    if (event.cron !== "0 * * * *") {
      try {
        await db(env).query("SELECT 1");
      } catch {
        /* próxima ronda tenta */
      }
      return;
    }
    await checkExpired(env);
  },
};
