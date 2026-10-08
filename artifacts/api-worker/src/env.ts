// Tipos do ambiente do Worker (segredos via
// `wrangler secret put DATABASE_URL|TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID`).
// Sem R2 (exige cartão): imagens ficam no Telegram + Cache API do edge.
export interface Env {
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}
