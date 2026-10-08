// Tipos do ambiente do Worker (bindings configurados no wrangler.toml e
// segredos via `wrangler secret put DATABASE_URL|TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID`).

// Subconjunto mínimo da API R2 usado pelo worker (evita a dep
// @cloudflare/workers-types só para isto).
export interface R2ObjectBody {
  readonly body: ReadableStream<Uint8Array>;
  readonly size: number;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ArrayBuffer | Uint8Array | ReadableStream | string,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }
  ): Promise<unknown>;
}

export interface Env {
  DATABASE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  YESOLA_IMAGES: R2Bucket;
}
