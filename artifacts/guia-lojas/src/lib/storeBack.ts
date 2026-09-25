/**
 * Voltar da página de loja (/loja/:id) com fallback determinístico.
 *
 * O problema: `window.history.back()` falha quando a loja foi aberta por
 * link direto (WhatsApp, partilha) — ou não há histórico (fica numa página
 * vazia) ou o histórico anterior é uma app externa (sai da YESOLA).
 *
 * Regra:
 * - Se a página anterior é da própria YESOLA (mesma origem via
 *   document.referrer), usa history.back() para preservar o contexto
 *   (ex.: Explorar -> Loja volta ao Explorar).
 * - Caso contrário, vai para a home "/" da vertical indicada em ?from=
 *   (ex.: ?from=beleza -> home Beleza), com reload para garantir que o
 *   contexto de loja (localStorage + estado do Router) fica correto.
 */
const FROM_MAP: Record<string, string> = {
  weddings: "weddings",
  love: "love-services",
  "love-services": "love-services",
  collection: "collection",
  business: "business",
  formacoes: "formacoes",
  eventos: "eventos",
  imoveis: "imoveis",
  infantil: "infantil",
  automoveis: "automoveis",
  saude: "saude",
  beleza: "beleza",
  casa: "casa",
  tecnologia: "tecnologia-electronicos",
  "tecnologia-electronicos": "tecnologia-electronicos",
  alimentacao: "alimentacao-restauracao",
  "alimentacao-restauracao": "alimentacao-restauracao",
  turismo: "turismo-lazer",
  "turismo-lazer": "turismo-lazer",
  desporto: "desporto-fitness",
  "desporto-fitness": "desporto-fitness",
  empregos: "empregos-oportunidades",
  "empregos-oportunidades": "empregos-oportunidades",
  agricultura: "agricultura-agronegocio",
  "agricultura-agronegocio": "agricultura-agronegocio",
  influenciadores: "influenciadores-criadores",
  "influenciadores-criadores": "influenciadores-criadores",
  transportes: "transportes-logistica",
  "transportes-logistica": "transportes-logistica",
  servicos: "servicos-profissionais",
  "servicos-profissionais": "servicos-profissionais",
  "servicos-prof": "servicos-profissionais",
};

/** Vertical correspondente ao parâmetro ?from= (ou null se desconhecido). */
export function storeFromParam(from: string | null): string | null {
  if (!from) return null;
  return FROM_MAP[from.toLowerCase()] ?? null;
}

/** Volta atrás se viável; senão vai para a home da vertical de `from`. */
export function goBackFromStore(from: string | null): void {
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === window.location.origin && window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch {
    /* cai no fallback */
  }
  const store = storeFromParam(from);
  if (store) {
    try {
      localStorage.setItem("eliora-selected-store", store);
    } catch {
      /* armazenamento indisponível */
    }
  }
  // Reload intencional: o Router lê a loja do localStorage só ao iniciar,
  // por isso a navegação SPA (setLocation) podia mostrar a vertical errada.
  window.location.href = "/";
}
