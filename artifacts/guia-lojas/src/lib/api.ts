import { Store, Product } from "@/data/mock";

// CATEGORIES
export async function getCategories() {
  const res = await fetch(`/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(data: any) {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function updateCategory(id: string, data: any) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
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

// Calcula dinamicamente se a loja está aberta baseada no horário padrão e fuso de Angola
function applyDynamicOpenStatus(store: Store): Store {
  if (store.isOpen === false) return store; // Respeita fecho forçado pelo dono

  const agora = new Date();
  const angolaTime = new Date(agora.toLocaleString("en-US", { timeZone: "Africa/Luanda" }));
  const diaSemana = angolaTime.getDay(); // 0 = Domingo
  const horaAtual = angolaTime.getHours() * 100 + angolaTime.getMinutes();

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

// PUT /api/stores/:id — Atualizar dados e status da loja
export async function updateStore(id: string, store: Partial<Store>): Promise<void> {
  const res = await fetch(`/api/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(store),
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

// POST /api/media/upload — Upload de imagem via Telegram
export async function uploadImage(imageBase64: string, filename: string): Promise<{ imageUrl: string }> {
  const res = await fetch("/api/media/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, filename }),
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
export async function linkStore(data: { userId?: string; phone?: string; storeName: string; category: string; province?: string; municipality?: string; address?: string }): Promise<any> {
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
