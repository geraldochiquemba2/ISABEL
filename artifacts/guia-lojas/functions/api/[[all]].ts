// Proxy /api/* -> API no Render (Cloudflare Pages Function).
// Mantém o frontend a chamar /api em same-origin: zero mudanças no código,
// sem problemas de CORS nem cookies. Define API_HOST nas variáveis do Pages
// (ex: https://isabel-xxxx.onrender.com). Sem API_HOST, responde 503.
export async function onRequest(context: {
  request: Request;
  params: Record<string, string | string[]>;
  env: Record<string, string>;
}) {
  const host = (context.env.API_HOST || "").replace(/\/+$/, "");
  if (!host) {
    return new Response("API_HOST em falta nas variáveis do Pages", { status: 503 });
  }
  const url = new URL(context.request.url);
  const target = host + url.pathname + url.search;
  const headers = new Headers(context.request.headers);
  headers.delete("host");
  headers.delete("content-length");
  const init: RequestInit = {
    method: context.request.method,
    headers,
    redirect: "manual",
  };
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    init.body = context.request.body;
    // @ts-expect-error duplex exigido pelo runtime para streaming
    init.duplex = "half";
  }
  const res = await fetch(target, init);
  const out = new Headers(res.headers);
  out.delete("content-encoding");
  out.delete("content-length");
  return new Response(res.body, { status: res.status, headers: out });
}
