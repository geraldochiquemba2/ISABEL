import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminUsersFiltered, approveLojista, rejectLojista, suspendLojista,
  reactivateLojista, cancelApplication, resetUserPassword,
  fetchStores, updateStoreFeatured, getCategories, createCategory, updateCategory, deleteCategory,
  fetchPasswordResetRequests, approvePasswordReset, rejectPasswordReset,
  fetchPendingCarrinhoRequests, approveCarrinhoAccess, rejectCarrinhoAccess,
} from "@/lib/api";
import {
  KeyRound, ShieldAlert, Phone, Store, Package, Check, X, Ban, RefreshCw,
  Eye, Star, TrendingUp, FolderPlus, Edit2, Trash2, ChevronDown, ChevronUp,
  RotateCcw, ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inputCls = "w-full border border-[#EDE8DE] bg-white py-3 px-4 text-sm text-[#2D2C2B] placeholder:text-[#87909a] outline-none focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/10 transition-all rounded-xl";
const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-1.5";

type AdminTab = "utilizadores" | "categorias" | "lojas" | "password-resets" | "carrinhos";

interface AdminPanelProps {
  storeType: string;
  accentColor?: string;
}

export default function AdminPanel({ storeType, accentColor = "#D4A843" }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("utilizadores");
  const queryClient = useQueryClient();

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "utilizadores", label: "Utilizadores", icon: <ShieldAlert size={15} /> },
    { id: "password-resets", label: "Pedidos de Reset", icon: <RotateCcw size={15} /> },
    { id: "carrinhos", label: "Carrinhos", icon: <ShoppingCart size={15} /> },
    { id: "categorias", label: "Categorias", icon: <FolderPlus size={15} /> },
    { id: "lojas", label: "Destacar Lojas", icon: <Star size={15} /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-[#2D2C2B] flex items-center gap-2">
          <ShieldAlert size={20} /> Painel de Administração
        </h2>
        <p className="text-sm text-[#87909a] mt-1">Gestão de utilizadores, categorias e lojas em destaque.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-[#EDE8DE] overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === t.id
                ? "border-current text-[#2D2C2B]"
                : "border-transparent text-[#87909a] hover:text-[#2D2C2B]"
            }`}
            style={tab === t.id ? { color: accentColor, borderColor: accentColor } : {}}
          >
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {tab === "utilizadores" && <UtilizadoresTab storeType={storeType} accentColor={accentColor} />}
      {tab === "password-resets" && <PasswordResetsTab storeType={storeType} accentColor={accentColor} />}
      {tab === "carrinhos" && <CarrinhosTab storeType={storeType} accentColor={accentColor} />}
      {tab === "categorias" && <CategoriasTab accentColor={accentColor} />}
      {tab === "lojas" && <LojasTab storeType={storeType} accentColor={accentColor} />}
    </div>
  );
}

// ── TAB: UTILIZADORES ──────────────────────────────────────
function UtilizadoresTab({ storeType, accentColor }: { storeType: string; accentColor: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetId, setResetId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [suspendId, setSuspendId] = useState<number | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const all = await fetchAdminUsersFiltered(storeType);
      setUsers(all.filter((u: any) => u.phone !== "999999999"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleApprove(id: number) {
    try { await approveLojista(id); loadUsers(); } catch { alert("Erro ao aprovar."); }
  }

  async function handleReject() {
    if (!rejectId || !rejectReason.trim()) return;
    try { await rejectLojista(rejectId, rejectReason); setRejectId(null); setRejectReason(""); loadUsers(); } catch { alert("Erro ao recusar."); }
  }

  async function handleSuspend() {
    if (!suspendId || !suspendReason.trim()) return;
    try { await suspendLojista(suspendId, suspendReason); setSuspendId(null); setSuspendReason(""); loadUsers(); } catch { alert("Erro ao suspender."); }
  }

  async function handleReactivate(id: number) {
    try { await reactivateLojista(id); loadUsers(); } catch { alert("Erro ao reativar."); }
  }

  async function handleCancel(id: number) {
    if (!confirm("Cancelar e eliminar esta conta?")) return;
    try { await cancelApplication(id); loadUsers(); } catch { alert("Erro ao cancelar."); }
  }

  async function handleReset(id: number) {
    try { await resetUserPassword(id); setResetId(null); alert("Senha redefinida para 123456789."); loadUsers(); } catch { alert("Erro ao redefinir senha."); }
  }

  const filtered = users.filter((u) => {
    if (filter === "all") return true;
    return u.status === filter;
  });

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "Todos", count: users.length },
          { id: "PENDENTE", label: "Pendentes", count: users.filter((u) => u.status === "PENDENTE").length },
          { id: "APROVADO", label: "Aprovados", count: users.filter((u) => u.status === "APROVADO").length },
          { id: "SUSPENSO", label: "Suspensos", count: users.filter((u) => u.status === "SUSPENSO").length },
          { id: "RECUSADO", label: "Recusados", count: users.filter((u) => u.status === "RECUSADO").length },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id ? "text-white" : "bg-white text-[#87909a] border border-[#EDE8DE] hover:bg-gray-50"}`}
            style={filter === f.id ? { backgroundColor: accentColor } : {}}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="border border-[#EDE8DE] rounded-2xl p-4 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f0f0f0] flex-shrink-0 flex items-center justify-center">
                  <Phone size={18} className="text-[#87909a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{u.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      u.status === "APROVADO" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      u.status === "PENDENTE" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                      u.status === "SUSPENSO" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      "bg-red-50 text-red-600 border border-red-200"
                    }`}>{u.status}</span>
                  </div>
                  <p className="text-xs text-[#87909a]">{u.phone}</p>
                  <p className="text-xs text-[#87909a]">Loja: {u.storeName || "—"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {u.status === "PENDENTE" && (
                  <>
                    <button onClick={() => handleApprove(u.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <Check size={11} /> Aprovar
                    </button>
                    <button onClick={() => setRejectId(u.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <X size={11} /> Recusar
                    </button>
                  </>
                )}
                {u.status === "APROVADO" && (
                  <>
                    <button onClick={() => setSuspendId(u.id)} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <Ban size={11} /> Suspender
                    </button>
                    <button onClick={() => setResetId(u.id)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <KeyRound size={11} /> Reset Senha
                    </button>
                  </>
                )}
                {u.status === "SUSPENSO" && (
                  <>
                    <button onClick={() => handleReactivate(u.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <RefreshCw size={11} /> Reativar
                    </button>
                    <button onClick={() => setResetId(u.id)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                      <KeyRound size={11} /> Reset Senha
                    </button>
                  </>
                )}
                {u.status === "RECUSADO" && (
                  <button onClick={() => handleCancel(u.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                    <Trash2 size={11} /> Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhum utilizador encontrado.</p>}
      </div>

      {/* Modal: Reset Senha */}
      <AnimatePresence>
        {resetId && (
          <Modal onClose={() => setResetId(null)} title="Redefinir Senha">
            <p className="text-xs text-[#87909a]">A senha será redefinida para <strong>123456789</strong>.</p>
            <div className="flex justify-end gap-2 text-xs mt-4">
              <button onClick={() => setResetId(null)} className="px-4 py-2 border border-[#EDE8DE] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={() => handleReset(resetId)} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">Confirmar</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal: Recusar */}
      <AnimatePresence>
        {rejectId && (
          <Modal onClose={() => { setRejectId(null); setRejectReason(""); }} title="Recusar Utilizador">
            <div className="space-y-3">
              <div><label className={labelCls}>Motivo da recusa</label><textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className={inputCls} placeholder="Descreva o motivo..." /></div>
              <div className="flex justify-end gap-2 text-xs">
                <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="px-4 py-2 border border-[#EDE8DE] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
                <button onClick={handleReject} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50">Recusar</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal: Suspender */}
      <AnimatePresence>
        {suspendId && (
          <Modal onClose={() => { setSuspendId(null); setSuspendReason(""); }} title="Suspender Utilizador">
            <div className="space-y-3">
              <div><label className={labelCls}>Motivo da suspensão</label><textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={3} className={inputCls} placeholder="Descreva o motivo..." /></div>
              <div className="flex justify-end gap-2 text-xs">
                <button onClick={() => { setSuspendId(null); setSuspendReason(""); }} className="px-4 py-2 border border-[#EDE8DE] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
                <button onClick={handleSuspend} disabled={!suspendReason.trim()} className="px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50">Suspender</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── TAB: CATEGORIAS ──────────────────────────────────────
function PasswordResetsTab({ storeType, accentColor }: { storeType: string; accentColor: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const all = await fetchPasswordResetRequests(storeType);
      setRequests(all);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleApprove(id: number) {
    try { await approvePasswordReset(id); loadRequests(); } catch { alert("Erro ao aprovar."); }
  }

  async function handleReject(id: number) {
    if (!confirm("Rejeitar este pedido?")) return;
    try { await rejectPasswordReset(id); loadRequests(); } catch { alert("Erro ao rejeitar."); }
  }

  const pending = requests.filter((r) => r.status === "PENDENTE");
  const resolved = requests.filter((r) => r.status !== "PENDENTE");

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#87909a]">{pending.length} pedido(s) pendente(s)</p>

      {pending.length === 0 && (
        <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhum pedido pendente.</p>
      )}

      <div className="space-y-3">
        {pending.map((r) => (
          <div key={r.id} className="border border-[#EDE8DE] rounded-2xl p-4 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-50 flex-shrink-0 flex items-center justify-center">
                  <RotateCcw size={18} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{r.userName || "Utilizador"}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-amber-600 border border-amber-200">PENDENTE</span>
                  </div>
                  <p className="text-xs text-[#87909a]">{r.phone}</p>
                  <p className="text-xs text-[#87909a]">Loja: {r.storeName || "—"}</p>
                  <p className="text-[10px] text-[#87909a] mt-1">Pediu em: {new Date(r.createdAt).toLocaleString("pt-AO")}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => handleApprove(r.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                  <Check size={11} /> Aprovar
                </button>
                <button onClick={() => handleReject(r.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors">
                  <X size={11} /> Rejeitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resolved.length > 0 && (
        <>
          <p className="text-sm text-[#87909a] pt-4 border-t border-[#EDE8DE]">Histórico</p>
          <div className="space-y-2">
            {resolved.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-white border border-[#EDE8DE] rounded-xl px-4 py-3 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <RotateCcw size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{r.userName || r.phone}</p>
                    <p className="text-[10px] text-[#87909a]">{r.phone}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  r.status === "APROVADO" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
                }`}>{r.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── TAB: CATEGORIAS ──────────────────────────────────────
function CategoriasTab({ accentColor }: { accentColor: string }) {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", icon: "", coverImage: "" });

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    try { const cats = await getCategories(); setCategories(cats); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    try {
      if (editId) { await updateCategory(editId, form); }
      else { await createCategory(form); }
      setShowForm(false); setEditId(null); setForm({ name: "", icon: "", coverImage: "" }); loadCategories();
    } catch (e: any) { alert("Erro: " + e.message); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta categoria?")) return;
    try { await deleteCategory(id); loadCategories(); } catch (e: any) { alert("Erro: " + e.message); }
  }

  function startEdit(cat: any) {
    setEditId(cat.id); setForm({ name: cat.name, icon: cat.icon || "", coverImage: cat.coverImage || "" }); setShowForm(true);
  }

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#87909a]">{categories.length} categorias</p>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", icon: "", coverImage: "" }); }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors"
          style={{ backgroundColor: accentColor }}>
          <FolderPlus size={13} /> Nova Categoria
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-white rounded-2xl border border-[#EDE8DE] p-5 space-y-3">
              <h3 className="text-sm font-semibold">{editId ? "Editar Categoria" : "Nova Categoria"}</h3>
              <div><label className={labelCls}>Nome</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Ex: Moda" /></div>
              <div><label className={labelCls}>Ícone (nome lucide)</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls} placeholder="Ex: shirt" /></div>
              <div><label className={labelCls}>Imagem de capa (URL)</label><input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className={inputCls} placeholder="https://..." /></div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={!form.name.trim()} className="text-white px-4 py-2 rounded-full text-xs font-semibold disabled:opacity-50" style={{ backgroundColor: accentColor }}>
                  {editId ? "Atualizar" : "Criar"}
                </button>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 border border-[#EDE8DE] rounded-full text-xs text-[#87909a] hover:bg-gray-50">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-white border border-[#EDE8DE] rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              {cat.coverImage && <img src={cat.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
              <div>
                <p className="text-sm font-medium text-[#2D2C2B]">{cat.name}</p>
                <p className="text-[10px] text-[#87909a]">{cat.subcategories?.length || 0} subcategorias</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => startEdit(cat)} className="p-1.5 text-[#87909a] hover:text-[#D4A843] transition-colors"><Edit2 size={13} /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-[#87909a] hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhuma categoria.</p>}
      </div>
    </div>
  );
}

// ── TAB: DESTACAR LOJAS ──────────────────────────────────
function LojasTab({ storeType, accentColor }: { storeType: string; accentColor: string }) {
  const queryClient = useQueryClient();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStores(); }, []);

  async function loadStores() {
    setLoading(true);
    try {
      const all = await fetchStores({ storeType });
      setStores(all.filter((s: any) => s.phone !== "999999999"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    try { await updateStoreFeatured(id, !current); loadStores(); } catch { alert("Erro ao atualizar."); }
  }

  async function handleToggleTrending(id: string, current: boolean) {
    try {
      await fetch(`/api/stores/${id}/trending`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrending: !current }),
      });
      loadStores();
    } catch { alert("Erro ao atualizar."); }
  }

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#87909a]">{stores.length} lojas — destaque nas páginas iniciais</p>

      <div className="space-y-3">
        {stores.map((store) => (
          <div key={store.id} className="border border-[#EDE8DE] rounded-2xl p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                <img src={store.coverImage || store.logoUrl || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold">{store.name}</h3>
                <p className="text-xs text-[#87909a]">{store.category} · {store.province || "—"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleToggleFeatured(store.id, store.isFeatured)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors ${
                  store.isFeatured ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-gray-100 text-[#87909a] border border-[#EDE8DE] hover:bg-gray-50"
                }`}>
                <Star size={12} className={store.isFeatured ? "fill-amber-400" : ""} /> {store.isFeatured ? "Em destaque" : "Destacar"}
              </button>
              <button onClick={() => handleToggleTrending(store.id, store.isTrending)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors ${
                  store.isTrending ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-gray-100 text-[#87909a] border border-[#EDE8DE] hover:bg-gray-50"
                }`}>
                <TrendingUp size={12} /> {store.isTrending ? "Em alta" : "Trending"}
              </button>
            </div>
          </div>
        ))}
        {stores.length === 0 && <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhuma loja encontrada.</p>}
      </div>
    </div>
  );
}

// ── CARRINHOS TAB ──────────────────────────────────────────
function CarrinhosTab({ storeType, accentColor }: { storeType: string; accentColor: string }) {
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pending-carrinho", storeType],
    queryFn: () => fetchPendingCarrinhoRequests(storeType),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveCarrinhoAccess(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["pending-carrinho"] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectCarrinhoAccess(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["pending-carrinho"] }); },
  });

  if (isLoading) return <p className="text-sm text-[#87909a] py-8 text-center">A carregar...</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#87909a]">Pedidos de acesso ao carrinho pendentes.</p>
      {requests.length === 0 ? (
        <p className="text-sm text-[#87909a] py-8 text-center">Nenhum pedido pendente.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <div key={req.id} className="bg-white border border-[#EDE8DE] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#2D2C2B]">{req.name}</p>
                <p className="text-xs text-[#87909a]">{req.ownerName} · {req.ownerPhone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approveMutation.mutate(req.id)}
                  className="flex items-center gap-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Check size={13} /> Aprovar
                </button>
                <button
                  onClick={() => rejectMutation.mutate(req.id)}
                  className="flex items-center gap-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X size={13} /> Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MODAL ──────────────────────────────────────────────
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl border border-[#EDE8DE] shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
}
