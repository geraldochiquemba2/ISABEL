import { Store, Product } from "@/data/mock";

// CATEGORIES
export async function getCategories(storeType?: string) {
  const res = await fetch(`/api/categories${storeType ? `?store_type=${encodeURIComponent(storeType)}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function categoryError(res: Response, fallback: string): Promise<Error> {
  try {
    const j = await res.json();
    if (j?.error) return new Error(j.error);
  } catch { /* ignora */ }
  return new Error(fallback);
}

export async function createCategory(data: any) {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await categoryError(res, "Failed to create category");
  return res.json();
}

export async function updateCategory(id: string, data: any) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await categoryError(res, "Failed to update category");
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw await categoryError(res, "Failed to delete category");
  return res.json();
}

// GET /api/stores — Buscar todas as lojas com filtros
export async function fetchStores(filters?: {
  province?: string;
  municipality?: string;
  category?: string;
  q?: string;
  storeType?: string;
}): Promise<Store[]> {
  const params = new URLSearchParams();
  if (filters?.province) params.append("province", filters.province);
  if (filters?.municipality) params.append("municipality", filters.municipality);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.q) params.append("q", filters.q);
  if (filters?.storeType) params.append("store_type", filters.storeType);

  const res = await fetch(`/api/stores?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar lojas");
  const stores: Store[] = await res.json();
  return stores.map(applyDynamicOpenStatus);
}

// GET /api/stores/:id — Detalhes de uma loja
export async function fetchStoreById(id: string): Promise<Store> {
  const res = await fetch(`/api/stores/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar loja");
  const store: Store = await res.json();
  return applyDynamicOpenStatus(store);
}

// Calcula dinamicamente se a loja está aberta baseada no horário
// configurado pelo dono (store.schedule) e fuso de Angola.
// Formato do schedule: [{ label: "Segunda a Sexta", closed, open: "08:00", close: "18:00" }, { Sábado }, { Domingo }]
// Sem schedule válido, usa o horário padrão (Seg–Sex 08:00–18:00, Sáb 09:00–14:00, Dom fechado).
function parseHora(hhmm: string): number | null {
  if (typeof hhmm !== "string") return null;
  const m = hhmm.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 100 + min;
}

function applyDynamicOpenStatus(store: Store): Store {
  if (store.isOpen === false) return store; // Respeita fecho forçado pelo dono

  const agora = new Date();
  const angolaTime = new Date(agora.toLocaleString("en-US", { timeZone: "Africa/Luanda" }));
  const diaSemana = angolaTime.getDay(); // 0 = Domingo
  const horaAtual = angolaTime.getHours() * 100 + angolaTime.getMinutes();

  // Horário configurado pelo dono (pode vir como string JSON da BD)
  let sched: any = (store as any).schedule;
  if (typeof sched === "string") {
    try {
      sched = JSON.parse(sched);
    } catch {
      sched = null;
    }
  }

  if (Array.isArray(sched) && sched.length >= 3) {
    const dia = diaSemana >= 1 && diaSemana <= 5 ? sched[0] : diaSemana === 6 ? sched[1] : sched[2];
    if (!dia || dia.closed) return { ...store, isOpen: false };
    const abre = parseHora(dia.open);
    const fecha = parseHora(dia.close);
    if (abre === null || fecha === null) return { ...store, isOpen: false };
    // Suporta turno da noite (ex: 18:00–02:00)
    const isOpen = fecha > abre
      ? horaAtual >= abre && horaAtual < fecha
      : horaAtual >= abre || horaAtual < fecha;
    return { ...store, isOpen };
  }

  let isOpen = false;
  if (diaSemana >= 1 && diaSemana <= 5) {
    isOpen = horaAtual >= 800 && horaAtual < 1800;
  } else if (diaSemana === 6) {
    isOpen = horaAtual >= 900 && horaAtual < 1400;
  }

  return { ...store, isOpen };
}

// POST /api/stores — Criar ou atualizar uma loja
export async function saveStore(store: Store): Promise<void> {
  const res = await fetch("/api/stores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(store),
  });
  if (!res.ok) throw new Error("Erro ao salvar loja");
}

// PUT /api/stores/:id — Atualizar dados e status da loja.
// NUNCA envia isOpen: o objeto da loja no frontend já traz o status
// CALCULADO (horário); persisti-lo fechava a loja para sempre. O servidor
// preserva o flag da BD.
export async function updateStore(id: string, store: Partial<Store>): Promise<void> {
  const { isOpen: _computedIsOpen, ...rest } = store;
  const res = await fetch(`/api/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) throw new Error("Erro ao atualizar loja");
}

// PATCH /api/stores/:id/featured — Destacar loja
export async function updateStoreFeatured(id: string, isFeatured: boolean): Promise<void> {
  const res = await fetch(`/api/stores/${id}/featured`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFeatured }),
  });
  if (!res.ok) throw new Error("Erro ao destacar loja");
}

// PATCH /api/stores/:id/location — Atualizar localização
export async function updateStoreLocation(id: string, latitude: number | null, longitude: number | null): Promise<void> {
  const res = await fetch(`/api/stores/${id}/location`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar localização");
}

// POST /api/products — Criar produto
export async function createProduct(product: Partial<Product> & { storeId: string }): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Erro ao criar produto");
  return res.json();
}

// PUT /api/products/:id — Atualizar produto
export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Erro ao atualizar produto");
}

// DELETE /api/products/:id — Deletar produto
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar produto");
}

// POST /api/auth/register — Criar conta
export async function registerLojista(data: any): Promise<any> {
  // Barreira central: sem aceite expresso (Lei 22/11 art. 12) nem chama a API.
  if (data?.acceptedTerms !== true) {
    throw new Error("É obrigatório aceitar a Política de Privacidade e os Termos de Uso.");
  }
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = null;
  }
  if (!res.ok) throw new Error(json?.error || text || "Erro ao registrar conta");
  return json;
}

// POST /api/auth/login — Entrar na conta
export async function loginLojista(data: any): Promise<any> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = null;
  }
  if (!res.ok) throw new Error(json?.error || text || "Telefone ou senha incorretos");
  return json;
}

// GET /api/admin/users — Buscar todas as candidaturas
export async function fetchAdminUsers(): Promise<any[]> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Erro ao carregar utilizadores");
  return res.json();
}

// PUT /api/admin/users/:id/approve — Aprovar conta
export async function approveLojista(id: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/approve`, { method: "PUT" });
  if (!res.ok) throw new Error("Erro ao aprovar utilizador");
}

// PUT /api/admin/users/:id/reject — Recusar conta com motivo
export async function rejectLojista(id: string, reason: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Erro ao recusar utilizador");
}

// DELETE /api/admin/users/:id/cancel — Cancelar conta/solicitação pendente
export async function cancelApplication(id: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/cancel`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao cancelar solicitação");
}

// GET /api/auth/status/:id — Obter status atualizado do utilizador
export async function fetchUserStatus(id: string): Promise<any> {
  const res = await fetch(`/api/auth/status/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar status do utilizador");
  return res.json();
}

// PUT /api/admin/users/:id/suspend — Suspender conta
export async function suspendLojista(id: string, reason: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/suspend`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Erro ao suspender utilizador");
}

// PUT /api/admin/users/:id/reactivate — Reativar conta suspensa
export async function reactivateLojista(id: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/reactivate`, { method: "PUT" });
  if (!res.ok) throw new Error("Erro ao reativar utilizador");
}

// POST /api/media/upload — Upload de imagem (R2 no Worker; Telegram como arquivo).
// Gera o thumb 480px no cliente (canvas) para o servidor não precisar de
// sharp: cobre todos os pontos de upload de uma vez. Servidor antigo ignora
// o campo extra (compatível durante a migração).
function makeThumb(base64: string, maxWidth = 480): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width <= maxWidth) return resolve(base64);
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(base64);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        } catch {
          resolve(base64);
        }
      };
      img.onerror = () => resolve(base64);
      img.src = base64;
    } catch {
      resolve(base64);
    }
  });
}

export async function uploadImage(imageBase64: string, filename: string): Promise<{ imageUrl: string; thumbnailUrl?: string }> {
  const thumbBase64 = await makeThumb(imageBase64);
  const res = await fetch("/api/media/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, thumbBase64, filename }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erro no upload da imagem");
  return json;
}
// PUT /api/admin/users/:id/reset-password — Admin redefine senha para padrão
export async function resetUserPassword(id: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: "PUT" });
  if (!res.ok) throw new Error("Erro ao redefinir senha");
}

// PUT /api/auth/change-password — Utilizador altera a própria senha
export async function changePassword(userId: string, newPassword: string): Promise<void> {
  const res = await fetch("/api/auth/change-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, newPassword }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao alterar a senha");
}

// POST /api/auth/link-store — Associar loja a utilizador existente
export async function linkStore(data: { userId?: string; phone?: string; storeName: string; category: string; categories?: string[]; province?: string; municipality?: string; locality?: string; address?: string }): Promise<any> {
  const res = await fetch("/api/auth/link-store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao associar loja");
  return json;
}

// PUT /api/auth/rename-store — Renomear loja
export async function renameStore(storeId: string, newName: string): Promise<any> {
  const res = await fetch("/api/auth/rename-store", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, newName }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao renomear loja");
  return json;
}

// ── Wedding Groups ──────────────────────────────────────────
export async function fetchWeddingGroups(): Promise<any[]> {
  const res = await fetch("/api/wedding-groups");
  if (!res.ok) throw new Error("Erro ao buscar grupos de casamento");
  return res.json();
}

export async function createWeddingGroup(data: any): Promise<any> {
  const res = await fetch("/api/wedding-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao criar grupo");
  return json;
}

export async function updateWeddingGroup(id: string, data: any): Promise<any> {
  const res = await fetch(`/api/wedding-groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao atualizar grupo");
  return json;
}

export async function deleteWeddingGroup(id: string): Promise<any> {
  const res = await fetch(`/api/wedding-groups/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao eliminar grupo");
  return json;
}

// ── Admin Users (with store_type filter) ────────────────────
export async function fetchAdminUsersFiltered(storeType?: string): Promise<any[]> {
  const url = storeType ? `/api/admin/users?store_type=${storeType}` : "/api/admin/users";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao carregar utilizadores");
  return res.json();
}

// ── Password Reset Requests ─────────────────────────────────
export async function requestPasswordReset(phone: string, storeType: string): Promise<any> {
  const res = await fetch("/api/auth/request-password-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, storeType }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao solicitar redefinição");
  return json;
}

export async function fetchPasswordResetRequests(storeType?: string): Promise<any[]> {
  const url = storeType ? `/api/admin/password-reset-requests?store_type=${storeType}` : "/api/admin/password-reset-requests";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao carregar pedidos");
  return res.json();
}

export async function approvePasswordReset(requestId: number): Promise<void> {
  const res = await fetch(`/api/admin/password-reset-requests/${requestId}/approve`, { method: "PUT" });
  if (!res.ok) throw new Error("Erro ao aprovar pedido");
}

export async function rejectPasswordReset(requestId: number): Promise<void> {
  const res = await fetch(`/api/admin/password-reset-requests/${requestId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao rejeitar pedido");
}

// POST /api/auth/admin-login — Entrar na administração (lugares)
export async function adminLogin(phone: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error || "Credenciais inválidas");
}

// ── Lugares (igrejas e serviços públicos, sem assinatura) ──
export interface Place {
  id: number; name: string; kind: string; category?: string; address?: string;
  province?: string; municipality?: string; locality?: string;
  latitude?: number | null; longitude?: number | null;
  phone?: string; source?: string; osmId?: string;
}

export async function fetchPlaces(filters?: {
  kind?: string; province?: string; municipality?: string; q?: string;
}): Promise<Place[]> {
  const params = new URLSearchParams();
  if (filters?.kind) params.append("kind", filters.kind);
  if (filters?.province) params.append("province", filters.province);
  if (filters?.municipality) params.append("municipality", filters.municipality);
  if (filters?.q) params.append("q", filters.q);
  const res = await fetch(`/api/places?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar lugares");
  return res.json();
}

export async function createPlace(data: Partial<Place>): Promise<{ success: boolean; id: number }> {
  const res = await fetch("/api/places", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro ao criar lugar");
  return json;
}

export async function updatePlace(id: number, data: Partial<Place>): Promise<void> {
  const res = await fetch(`/api/places/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar lugar");
}

export async function deletePlace(id: number): Promise<void> {
  const res = await fetch(`/api/places/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao remover lugar");
}

export async function importPlaces(bbox: {
  minLat: number; minLon: number; maxLat: number; maxLon: number; amenities?: string[];
}): Promise<{ success: boolean; imported: number; skipped: number; total: number }> {
  const res = await fetch("/api/places/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bbox),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Erro na importação");
  return json;
}

// ── WhatsApp Click Tracking ────────────────────────────────
export async function trackWhatsAppClick(storeId: string): Promise<void> {
  await fetch(`/api/stores/${storeId}/whatsapp-click`, { method: "PATCH" });
}

// ── Carrinho Access (Admin) ────────────────────────────────
export async function fetchPendingCarrinhoRequests(storeType?: string): Promise<any[]> {
  const url = storeType
    ? `/api/stores/carrinho-access/pending?store_type=${storeType}`
    : `/api/stores/carrinho-access/pending`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar pedidos");
  return res.json();
}

export async function approveCarrinhoAccess(storeId: string): Promise<void> {
  const res = await fetch(`/api/stores/${storeId}/carrinho-access`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "APROVADO" }),
  });
  if (!res.ok) throw new Error("Erro ao aprovar acesso");
}

export async function rejectCarrinhoAccess(storeId: string): Promise<void> {
  const res = await fetch(`/api/stores/${storeId}/carrinho-access`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "RECUSADO" }),
  });
  if (!res.ok) throw new Error("Erro ao rejeitar acesso");
}
