// Hash de passwords partilhado entre o servidor Node e o Cloudflare Worker.
// Só usa WebCrypto (disponível nos dois runtimes, sem imports nativos):
// PBKDF2-SHA256, 100k iterações, salt 16 bytes.
// Formato: `pbkdf2$100000$<salt-b64>$<hash-b64>`
// Contas antigas com plaintext continuam a entrar: o login aceita o valor
// legado e converte para hash nesse momento (upgrade transparente).

const DEFAULT_ITERATIONS = 100_000;
const SALT_LEN = 16;
const KEY_LEN_BITS = 256;

// Workers free só tem 10ms de CPU por pedido (erro 1101 acima disso):
// 100k iterações ≈ 80ms. Plano pago/Node usa 100k; no free define
// PASSWORD_ITERATIONS=5000 (~7ms). O hash guarda as iterações usadas, por
// isso a BD pode misturar valores sem problema.

// Declarações mínimas para não depender de @types/node nem lib DOM.
interface SubtleLike {
  importKey(
    format: "raw",
    keyData: Uint8Array,
    algo: { name: string },
    extractable: boolean,
    usages: string[]
  ): Promise<unknown>;
  deriveBits(
    algo: { name: string; salt: Uint8Array; iterations: number; hash: string },
    key: unknown,
    length: number
  ): Promise<ArrayBuffer>;
}
declare const crypto: {
  getRandomValues(array: Uint8Array): Uint8Array;
  subtle: SubtleLike;
};
declare class TextEncoder {
  encode(input?: string): Uint8Array;
}

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toB64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64[a >> 2] + B64[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < bytes.length ? B64[((b & 15) << 2) | (c >> 6)] : "=";
    out += i + 2 < bytes.length ? B64[c & 63] : "=";
  }
  return out;
}

function fromB64(s: string): Uint8Array {
  const clean = s.replace(/[^A-Za-z0-9+/=]/g, "");
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const n =
      (B64.indexOf(clean[i]) << 18) |
      (B64.indexOf(clean[i + 1]) << 12) |
      ((clean[i + 2] === "=" ? 0 : B64.indexOf(clean[i + 2])) << 6) |
      (clean[i + 3] === "=" ? 0 : B64.indexOf(clean[i + 3]));
    out.push((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
  let len = out.length;
  if (clean.endsWith("==")) len -= 2;
  else if (clean.endsWith("=")) len -= 1;
  return new Uint8Array(out.slice(0, len));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    KEY_LEN_BITS
  );
  return new Uint8Array(bits);
}

export function resolveIterations(raw?: string | null): number {
  const n = parseInt(String(raw || ""), 10);
  if (Number.isFinite(n) && n >= 1000 && n <= 1_000_000) return n;
  return DEFAULT_ITERATIONS;
}

export async function hashPassword(password: string, iterations: number = DEFAULT_ITERATIONS): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const hash = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${toB64(salt)}$${toB64(hash)}`;
}

export function isHashed(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith("pbkdf2$");
}

export async function verifyHash(stored: string, candidate: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const iterations = parseInt(parts[1], 10);
    if (!Number.isFinite(iterations) || iterations <= 0) return false;
    const salt = fromB64(parts[2]);
    const expected = fromB64(parts[3]);
    const actual = await pbkdf2(candidate, salt, iterations);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// Aceita hash novo OU plaintext legado (migração transparente no login).
export async function verifyPassword(stored: string, candidate: string): Promise<boolean> {
  if (typeof stored !== "string" || typeof candidate !== "string") return false;
  if (isHashed(stored)) return verifyHash(stored, candidate);
  return stored === candidate;
}

// Senha padrão de reset (o admin comunica-a ao lojista).
export const DEFAULT_PASSWORD = "123456789";

export async function isDefaultPassword(stored: string): Promise<boolean> {
  return verifyPassword(stored, DEFAULT_PASSWORD);
}
