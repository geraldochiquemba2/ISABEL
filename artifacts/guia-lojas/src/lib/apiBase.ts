// Base da API + interceptor fetch (modo empacotado iOS/Android).
// A WebView nativa corre em capacitor://localhost, por isso os caminhos
// relativos /api têm de apontar para a API pública. Na web se VITE_API_URL
// estiver vazio usa-se o valor por omissão (mesma origem em yesola.ao).
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || "https://yesola.ao";

const origFetch = window.fetch.bind(window);

function needsPrefix(input: unknown): input is string {
  return typeof input === "string" && input.startsWith("/api");
}

window.fetch = ((input: unknown, init?: RequestInit) => {
  if (needsPrefix(input)) {
    return origFetch(API_BASE + input, init);
  }
  return origFetch(input as RequestInfo, init);
}) as typeof window.fetch;
