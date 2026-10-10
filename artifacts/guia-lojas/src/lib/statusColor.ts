// Cor da faixa da status bar por área/loja (app nativa).
export const GOLD = "#B8860B";

export const VERTICAL_COLORS: Record<string, string> = {
  collection: GOLD,
  "alimentacao-restauracao": "#D84315",
  "agricultura-agronegocio": "#2E7D32",
  automoveis: "#0f1d32",
  bancos: "#1E40AF",
  beleza: "#7A4549",
  business: "#075342",
  casa: "#68635D",
  "desporto-fitness": "#E65100",
  "empregos-oportunidades": "#4527A0",
  entretenimento: "#7C3AED",
  eventos: "#C45125",
  formacoes: "#1E737B",
  imoveis: "#0B2D56",
  infantil: "#BE8E1B",
  "influenciadores-criadores": "#C2185B",
  "love-services": "#791226",
  saude: "#2E7D32",
  seguradoras: "#0F766E",
  "servicos-profissionais": "#1A237E",
  "tecnologia-electronicos": "#1565C0",
  "transportes-logistica": "#F57F17",
  "turismo-lazer": "#00796B",
  weddings: "#D8B532",
};

const PATH_KEYS = [
  "alimentacao", "agricultura", "automoveis", "bancos", "beleza",
  "business", "casa", "desporto", "empregos", "entretenimento",
  "eventos", "formacoes", "imoveis", "infantil", "influenciadores",
  "love", "saude", "seguradoras", "servicos", "tecnologia",
  "transportes", "turismo", "weddings",
] as const;

const PATH_TO_TYPE: Record<string, string> = {
  alimentacao: "alimentacao-restauracao",
  agricultura: "agricultura-agronegocio",
  automoveis: "automoveis",
  bancos: "bancos",
  beleza: "beleza",
  business: "business",
  casa: "casa",
  desporto: "desporto-fitness",
  empregos: "empregos-oportunidades",
  entretenimento: "entretenimento",
  eventos: "eventos",
  formacoes: "formacoes",
  imoveis: "imoveis",
  infantil: "infantil",
  influenciadores: "influenciadores-criadores",
  love: "love-services",
  saude: "saude",
  seguradoras: "seguradoras",
  servicos: "servicos-profissionais",
  tecnologia: "tecnologia-electronicos",
  transportes: "transportes-logistica",
  turismo: "turismo-lazer",
  weddings: "weddings",
};

export function setStatusColor(color: string) {
  try {
    document.documentElement.style.setProperty("--statusbar-bg", color);
  } catch { /* SSR/edge: ignora */ }
}

// Cor pela rota. Devolve null em /loja/* (a página da loja define pela loja).
export function colorForPath(pathname: string): string | null {
  const p = pathname.toLowerCase().split("?")[0];
  if (p.startsWith("/loja/")) return null;
  if (p === "/" || p === "") return "#FBF7EC"; // inicial: cor da página
  for (const k of PATH_KEYS) {
    if (p.includes(k)) return VERTICAL_COLORS[PATH_TO_TYPE[k]] || GOLD;
  }
  return GOLD;
}

// Cor de uma loja: a cor da loja, senão a da área, senão dourado.
export function colorForStore(store: { coverColor?: string | null; store_type?: string | null } | null | undefined): string {
  if (store?.coverColor) return store.coverColor;
  if (store?.store_type && VERTICAL_COLORS[store.store_type]) return VERTICAL_COLORS[store.store_type];
  return GOLD;
}
