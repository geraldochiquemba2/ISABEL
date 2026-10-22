export type SessionUser = {
  phone?: string;
  storeType?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

const DASHBOARD_BY_STORE_TYPE: Record<string, string> = {
  collection: "/dashboard",
  weddings: "/dashboard-weddings",
  "love-services": "/dashboard-love",
  business: "/dashboard-business",
  formacoes: "/dashboard-formacoes",
  eventos: "/dashboard-eventos",
  entretenimento: "/dashboard-entretenimento",
  imoveis: "/dashboard-imoveis",
  infantil: "/dashboard-infantil",
  automoveis: "/dashboard-automoveis",
  saude: "/dashboard-saude",
  beleza: "/dashboard-beleza",
  casa: "/dashboard-casa",
  "tecnologia-electronicos": "/dashboard-tecnologia",
  "alimentacao-restauracao": "/dashboard-alimentacao",
  "turismo-lazer": "/dashboard-turismo",
  "desporto-fitness": "/dashboard-desporto",
  "empregos-oportunidades": "/dashboard-empregos",
  "agricultura-agronegocio": "/dashboard-agricultura",
  "influenciadores-criadores": "/dashboard-influenciadores",
  "transportes-logistica": "/dashboard-transportes",
  "servicos-profissionais": "/dashboard-servicos",
  bancos: "/dashboard-bancos",
  seguradoras: "/dashboard-seguradoras",
};

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem("guialocal_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function dashboardPathForUser(user?: SessionUser | null): string {
  const current = user ?? getSessionUser();
  if (!current) return "/login";
  return DASHBOARD_BY_STORE_TYPE[current.storeType || "collection"] ?? "/dashboard";
}
