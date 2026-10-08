// Tipos do ambiente do Worker (segredos via
// `wrangler secret put DATABASE_URL|TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID`).
// Sem R2 (exige cartão): imagens ficam no Telegram + Cache API do edge.
// PASSWORD_ITERATIONS (opcional): plano free só tem 10ms de CPU (erro 1101
// acima disso) — aí define 5000. Pago/Node: 100000 (default).
import { resolveIterations } from "@workspace/password";

export function passwordIterations(env: Env): number {
  return resolveIterations((env as unknown as Record<string, string | undefined>).PASSWORD_ITERATIONS);
}
export interface Env {
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}
