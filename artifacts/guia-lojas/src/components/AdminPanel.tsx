import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import {
  Check, X, ShieldAlert, Ban, Info, Phone, Search,
  Star, TrendingUp, Tag, Plus, Trash2, Image, RefreshCw, KeyRound, Lightbulb
} from "lucide-react";
import {
  fetchAdminUsers, approveLojista, rejectLojista, suspendLojista, reactivateLojista, resetUserPassword,
  uploadImage,
} from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────
type MainTab = "contas" | "lojas" | "categorias" | "dicas" | "carrinhos";
type AccountTab = "PENDENTE" | "APROVADO" | "DESATIVADO";

// ── Helpers ─────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  "shirt", "smartphone", "utensils", "heart", "home", "car",
  "book-open", "dog", "scissors", "coffee", "camera", "music",
  "briefcase", "dumbbell", "baby", "leaf", "gem", "truck",
];

// ─────────────────────────────────────────────────────────────────────────
export function AdminPanel() {
  const [mainTab, setMainTab] = useState<MainTab>("contas");

  return (
    <PageTransition>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert size={24} /> Painel de Administração
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie contas, destaques e categorias da Eliora Collection
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex border-b border-black gap-1">
          {([
            { id: "contas",     label: "Contas",      icon: <Phone size={13} /> },
            { id: "lojas",      label: "Lojas",        icon: <Star size={13} /> },
            { id: "carrinhos",  label: "Carrinhos",    icon: <Tag size={13} /> },
            { id: "categorias", label: "Categorias",   icon: <Tag size={13} /> },
            { id: "dicas",      label: "Dicas de Estilo", icon: <Lightbulb size={13} /> },
          ] as { id: MainTab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id)}
              className={`pb-3 px-5 text-xs font-semibold uppercase tracking-wider relative transition-colors flex items-center gap-1.5 ${
                mainTab === t.id
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
              {mainTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          ))}
        </div>

        {mainTab === "contas"     && <ContasSection />}
        {mainTab === "lojas"      && <LojasSection />}
        {mainTab === "carrinhos"  && <CarrinhosAccessSection />}
        {mainTab === "categorias" && <CategoriasSection />}
        {mainTab === "dicas"      && <DicasSection />}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CONTAS (existing logic)
// ═══════════════════════════════════════════════════════════════════════
function ContasSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AccountTab>("PENDENTE");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [resetId, setResetId] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try { setUsers(await fetchAdminUsers()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    try { await approveLojista(id); loadUsers(); }
    catch { alert("Erro ao aprovar lojista."); }
  }

  async function handleRejectSubmit() {
    if (!rejectId) return;
    try { await rejectLojista(rejectId, rejectReason); setRejectId(null); setRejectReason(""); loadUsers(); }
    catch { alert("Erro ao recusar lojista."); }
  }

  async function handleSuspendSubmit() {
    if (!suspendId) return;
    try { await suspendLojista(suspendId, suspendReason); setSuspendId(null); setSuspendReason(""); loadUsers(); }
    catch { alert("Erro ao suspender lojista."); }
  }

  async function handleReactivate(id: string) {
    try { await reactivateLojista(id); loadUsers(); }
    catch { alert("Erro ao reativar conta."); }
  }

  async function handleResetPassword(id: string) {
    try {
      await resetUserPassword(id);
      setResetId(null);
      alert("Senha redefinida com sucesso! O lojista deverá usar a senha 123456789 para entrar.");
    } catch { alert("Erro ao redefinir senha."); }
  }

  const filtered = users
    .filter((u) => u.phone !== "999999999")
    .filter((u) => {
      if (activeTab === "PENDENTE") return u.status === "PENDENTE";
      if (activeTab === "APROVADO") return u.status === "APROVADO";
      if (activeTab === "DESATIVADO") return u.status === "SUSPENSO" || u.status === "RECUSADO";
      return true;
    })
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      return (u.name || "").toLowerCase().includes(term)
        || (u.phone || "").toLowerCase().includes(term)
        || (u.storeName || "").toLowerCase().includes(term)
        || (u.province || "").toLowerCase().includes(term);
    });

  if (loading) return <div className="text-center py-12 text-sm text-muted-foreground">A carregar utilizadores...</div>;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "PENDENTE",   label: "Pendentes" },
          { id: "APROVADO",   label: "Ativas" },
          { id: "DESATIVADO", label: "Desativadas" },
        ] as { id: AccountTab; label: string }[]).map((t) => {
          const count = users.filter(u => u.phone !== "999999999" && (
            t.id === "PENDENTE" ? u.status === "PENDENTE" :
            t.id === "APROVADO" ? u.status === "APROVADO" :
            u.status === "SUSPENSO" || u.status === "RECUSADO"
          )).length;
          return (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSearchTerm(""); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === t.id ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}>
              {t.label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Pesquisar por nome, telefone, loja..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-black rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-black bg-white" />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((user) => (
          <div key={user.id} className="border border-black rounded-2xl p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <img src={user.logoUrl || user.coverImage || "https://via.placeholder.com/150?text=Loja"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold">{user.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    user.status === "APROVADO" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                    user.status === "SUSPENSO" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    user.status === "RECUSADO" ? "bg-red-50 text-red-600 border border-red-200" :
                    "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}>{user.status === "SUSPENSO" ? "SUSPENSA" : user.status}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={11} />{user.phone}</p>
                <p className="text-xs text-muted-foreground"><strong>Loja:</strong> {user.storeName || `Loja de ${user.name}`}</p>
                <p className="text-xs text-muted-foreground"><strong>Local:</strong> {user.province}, {user.municipality}</p>
                {(user.status === "RECUSADO" || user.status === "SUSPENSO") && user.statusReason && (
                  <p className="text-xs text-red-500 mt-1 flex items-start gap-1 bg-red-50 p-2 rounded-lg border border-red-100">
                    <Ban size={11} className="mt-0.5 flex-shrink-0" /> <span><strong>Motivo:</strong> {user.statusReason}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {user.status === "PENDENTE" && (<>
                <button onClick={() => handleApprove(user.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><Check size={12} />Aprovar</button>
                <button onClick={() => setRejectId(user.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><X size={12} />Recusar</button>
              </>)}
              {user.status === "APROVADO" && (
                <button onClick={() => setSuspendId(user.id)} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><Ban size={12} />Suspender</button>
              )}
              {(user.status === "RECUSADO" || user.status === "SUSPENSO") && (
                <button onClick={() => handleReactivate(user.id)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"><Check size={12} />Reativar</button>
              )}
              <button
                onClick={() => setResetId(user.id)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                title="Redefinir senha para 123456789"
              >
                <KeyRound size={12} />Reset Senha
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-2xl">Nenhum utilizador encontrado.</p>
        )}
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Info size={16} className="text-red-500" />Motivo da Recusa</h3>
            <textarea placeholder="Motivo detalhado..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full border border-black rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-black" />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleRejectSubmit} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50">Confirmar Recusa</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Info size={16} className="text-amber-500" />Motivo da Suspensão</h3>
            <textarea placeholder="Motivo detalhado..." value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={4} className="w-full border border-black rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-black" />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setSuspendId(null); setSuspendReason(""); }} className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSuspendSubmit} disabled={!suspendReason.trim()} className="px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50">Confirmar Suspensão</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Confirm Modal */}
      {resetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><KeyRound size={16} className="text-blue-500" />Redefinir Senha</h3>
            <p className="text-xs text-muted-foreground">A senha deste lojista será redefinida para <strong>123456789</strong>. No próximo login, será obrigado a escolher uma nova senha.</p>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setResetId(null)} className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={() => handleResetPassword(resetId)} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">Confirmar Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOJAS — Featured + Trending
// ═══════════════════════════════════════════════════════════════════════
function LojasSection() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [storeTab, setStoreTab] = useState<"destaque" | "buscadas">("destaque");

  useEffect(() => { loadStores(); }, []);

  async function loadStores() {
    setLoading(true);
    try {
      const res = await fetch("/api/stores/admin/all");
      if (res.ok) {
        setStores(await res.json());
      }
    } catch (e) {
      console.error("Erro ao carregar lojas:", e);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeatured(store: any) {
    try {
      await fetch(`/api/stores/${store.id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !store.isFeatured }),
      });
      loadStores();
    } catch { alert("Erro ao actualizar destaque."); }
  }

  async function toggleTrending(store: any) {
    try {
      await fetch(`/api/stores/${store.id}/trending`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrending: !store.isTrending }),
      });
      loadStores();
    } catch { alert("Erro ao actualizar tendência."); }
  }

  const filtered = stores.filter((s) => {
    if (!search) return true;
    return (s.name || "").toLowerCase().includes(search.toLowerCase())
      || (s.category || "").toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="text-center py-12 text-sm text-muted-foreground">A carregar lojas...</div>;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button onClick={() => setStoreTab("destaque")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 ${storeTab === "destaque" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
          <Star size={12} /> Em Destaque
        </button>
        <button onClick={() => setStoreTab("buscadas")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 ${storeTab === "buscadas" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}>
          <TrendingUp size={12} /> Mais Buscadas
        </button>
      </div>

      <p className="text-xs text-muted-foreground bg-muted/60 border border-border rounded-xl px-4 py-2.5">
        {storeTab === "destaque"
          ? "✦ As lojas marcadas aparecem na secção \"Em Destaque\" da página inicial."
          : "✦ As lojas marcadas aparecem na secção \"Mais Buscadas\" da página inicial."}
      </p>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Pesquisar loja..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-black rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-black bg-white" />
      </div>

      {/* Stores list */}
      <div className="space-y-2">
        {filtered.map((store) => {
          const isActive = storeTab === "destaque" ? store.isFeatured : store.isTrending;
          return (
            <div key={store.id} className={`border rounded-2xl p-4 bg-white shadow-sm flex items-center gap-3 transition-all ${isActive ? "border-amber-400 bg-amber-50/30" : "border-black"}`}>
              <div className="w-12 h-12 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative border border-border">
                <img src={store.logoUrl || store.coverImage || "https://via.placeholder.com/100"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{store.name}</p>
                <p className="text-xs text-muted-foreground">{store.category} · {store.province}</p>
              </div>
              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700 border border-amber-300">
                    {storeTab === "destaque" ? "DESTAQUE" : "TENDÊNCIA"}
                  </span>
                )}
                <button
                  onClick={() => storeTab === "destaque" ? toggleFeatured(store) : toggleTrending(store)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                    isActive
                      ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                      : "border-black hover:bg-foreground hover:text-background"
                  }`}>
                  {storeTab === "destaque"
                    ? <><Star size={12} fill={isActive ? "currentColor" : "none"} />{isActive ? "Remover Destaque" : "Destacar"}</>
                    : <><TrendingUp size={12} />{isActive ? "Remover Tendência" : "Marcar Tendência"}</>}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-2xl">Nenhuma loja encontrada.</p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORIAS
// ═══════════════════════════════════════════════════════════════════════
function CategoriasSection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubcategories, setNewSubcategories] = useState<string[]>([]);
  const [newSubInput, setNewSubInput] = useState("");
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIsUsed, setEditIsUsed] = useState(false);
  const [editUsedSubs, setEditUsedSubs] = useState<string[]>([]);
  const [editSubcategories, setEditSubcategories] = useState<string[]>([]);
  const [editSubInput, setEditSubInput] = useState("");
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      setCategories(await res.json());
    } catch { console.error("Erro ao carregar categorias"); }
    finally { setLoading(false); }
  }

  function handleImageFile(file: File, setPreview: (s: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const id = newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: newName.trim(), coverImage: newCoverPreview, subcategories: newSubcategories }),
      });
      setNewName(""); setNewSubcategories([]); setNewSubInput(""); setNewCoverPreview(null); setShowAdd(false);
      loadCategories();
    } catch { alert("Erro ao criar categoria."); }
    finally { setSaving(false); }
  }

  async function handleEdit() {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), coverImage: editCoverPreview, subcategories: editSubcategories }),
      });
      setEditId(null); setEditName(""); setEditSubcategories([]); setEditSubInput(""); setEditCoverPreview(null);
      loadCategories();
    } catch { alert("Erro ao actualizar categoria."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja remover a categoria "${name}"?`)) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      loadCategories();
    } catch { alert("Erro ao remover categoria."); }
  }

  function startEdit(cat: any) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditIsUsed(cat.isUsed || false);
    setEditUsedSubs(cat.usedSubcategories || []);
    setEditSubcategories(cat.subcategories || []);
    setEditSubInput("");
    setEditCoverPreview(cat.cover_image || cat.coverImage || null);
  }

  function handleAddSub(isEdit: boolean) {
    if (isEdit) {
      if (!editSubInput.trim()) return;
      if (!editSubcategories.includes(editSubInput.trim())) {
        setEditSubcategories([...editSubcategories, editSubInput.trim()]);
      }
      setEditSubInput("");
    } else {
      if (!newSubInput.trim()) return;
      if (!newSubcategories.includes(newSubInput.trim())) {
        setNewSubcategories([...newSubcategories, newSubInput.trim()]);
      }
      setNewSubInput("");
    }
  }

  function handleRemoveSub(sub: string, isEdit: boolean) {
    if (isEdit) {
      setEditSubcategories(editSubcategories.filter(s => s !== sub));
    } else {
      setNewSubcategories(newSubcategories.filter(s => s !== sub));
    }
  }

  if (loading) return <div className="text-center py-12 text-sm text-muted-foreground">A carregar categorias...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} categorias registadas</p>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-full hover:opacity-80 transition-opacity">
          <Plus size={13} /> Nova Categoria
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-black rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* Cover image */}
            <div className="h-24 bg-muted relative overflow-hidden rounded-t-2xl">
              {(cat.cover_image || cat.coverImage) ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-70" 
                    style={{ backgroundImage: `url(${cat.cover_image || cat.coverImage})` }} 
                  />
                  <img src={cat.cover_image || cat.coverImage} alt={cat.name} className="w-full h-full object-contain relative z-10" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                  <Image size={28} />
                </div>
              )}
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.subcategories?.length ? `${cat.subcategories.length} subcategorias` : "Sem subcategorias"}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => startEdit(cat)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-black hover:bg-muted transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} disabled={cat.isUsed}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Tag size={16} />Nova Categoria</h3>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Nome</label>
              <input type="text" placeholder="Ex: Restaurantes" value={newName} onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Subcategorias</label>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Adicionar subcategoria..." value={newSubInput} onChange={(e) => setNewSubInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSub(false); } }}
                  className="flex-1 border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
                <button onClick={() => handleAddSub(false)} className="px-4 py-2 bg-muted text-foreground font-semibold text-xs rounded-xl hover:bg-border transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {newSubcategories.map(sub => (
                  <span key={sub} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md text-xs font-medium border border-border">
                    {sub} <button onClick={() => handleRemoveSub(sub, false)} className="text-foreground/70 hover:text-red-500 transition-colors flex items-center justify-center p-0.5"><X size={13}/></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Foto de Capa</label>
              {newCoverPreview && <img src={newCoverPreview} alt="" className="w-full h-28 object-cover rounded-xl mb-2 border border-border" />}
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl p-3 hover:bg-muted/40 transition-colors">
                <Image size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Clique para escolher imagem</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, setNewCoverPreview); }} />
              </label>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setShowAdd(false); setNewName(""); setNewSubcategories([]); setNewSubInput(""); setNewCoverPreview(null); }}
                className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleAdd} disabled={!newName.trim() || saving}
                className="px-4 py-2 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1.5">
                {saving ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />} Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Tag size={16} />Editar Categoria</h3>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Nome</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Subcategorias</label>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Adicionar subcategoria..." value={editSubInput} onChange={(e) => setEditSubInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSub(true); } }}
                  className="flex-1 border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
                <button onClick={() => handleAddSub(true)} className="px-4 py-2 bg-muted text-foreground font-semibold text-xs rounded-xl hover:bg-border transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {editSubcategories.map(sub => {
                  const isUsedSub = editUsedSubs.includes(sub);
                  return (
                    <span key={sub} className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md text-xs font-medium border border-border">
                      {sub} 
                      {!isUsedSub && (
                        <button onClick={() => handleRemoveSub(sub, true)} className="text-foreground/70 hover:text-red-500 transition-colors flex items-center justify-center p-0.5"><X size={13}/></button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Foto de Capa</label>
              {editCoverPreview && <img src={editCoverPreview} alt="" className="w-full h-28 object-cover rounded-xl mb-2 border border-border" />}
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl p-3 hover:bg-muted/40 transition-colors">
                <Image size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Clique para alterar imagem</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, setEditCoverPreview); }} />
              </label>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setEditId(null); setEditName(""); setEditSubcategories([]); setEditSubInput(""); setEditCoverPreview(null); }}
                className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleEdit} disabled={!editName.trim() || saving}
                className="px-4 py-2 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1.5">
                {saving ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />} Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DICAS DE ESTILO
// ═══════════════════════════════════════════════════════════════════════
function DicasSection() {
  const [dicas, setDicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [dicasList, setDicasList] = useState<string[]>([]);
  const [dicaInput, setDicaInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadDicas(); }, []);

  async function loadDicas() {
    setLoading(true);
    try {
      const res = await fetch("/api/style-tips");
      if (res.ok) setDicas(await res.json());
    } catch { console.error("Erro ao carregar dicas"); }
    finally { setLoading(false); }
  }

  function resetForm() {
    setTitulo(""); setDescricao(""); setImagem(""); setDicasList([]); setDicaInput("");
  }

  function startEdit(dica: any) {
    setEditId(dica.id);
    setTitulo(dica.titulo);
    setDescricao(dica.descricao);
    setImagem(dica.imagem || "");
    setDicasList(dica.dicas || []);
    setShowAdd(true);
  }

  function handleAddDica() {
    if (!dicaInput.trim()) return;
    if (!dicasList.includes(dicaInput.trim())) {
      setDicasList([...dicasList, dicaInput.trim()]);
    }
    setDicaInput("");
  }

  function handleRemoveDica(dica: string) {
    setDicasList(dicasList.filter(d => d !== dica));
  }

  async function handleImageFile(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const result = await uploadImage(base64, `dica-${Date.now()}.jpg`);
        setImagem(result.imageUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Erro ao fazer upload da imagem.");
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!titulo.trim() || !descricao.trim()) return;
    setSaving(true);
    try {
      const body = { titulo: titulo.trim(), descricao: descricao.trim(), imagem, dicas: dicasList };
      if (editId) {
        await fetch(`/api/style-tips/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/style-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      resetForm(); setEditId(null); setShowAdd(false);
      loadDicas();
    } catch { alert("Erro ao guardar dica."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja remover esta dica?")) return;
    try {
      await fetch(`/api/style-tips/${id}`, { method: "DELETE" });
      loadDicas();
    } catch { alert("Erro ao remover dica."); }
  }

  if (loading) return <div className="text-center py-12 text-sm text-muted-foreground">A carregar dicas...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{dicas.length} dicas de estilo</p>
        <button onClick={() => { resetForm(); setEditId(null); setShowAdd(true); }}
          className="flex items-center gap-1.5 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-full hover:opacity-80 transition-opacity">
          <Plus size={13} /> Nova Dica
        </button>
      </div>

      <div className="space-y-3">
        {dicas.map((dica) => (
          <div key={dica.id} className="border border-black rounded-2xl p-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              {dica.imagem && (
                <img src={dica.imagem} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{dica.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{dica.descricao}</p>
                {dica.dicas?.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">{dica.dicas.length} subdicas</p>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => startEdit(dica)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-black hover:bg-muted transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(dica.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        {dicas.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-2xl">Nenhuma dica encontrada.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Lightbulb size={16} /> {editId ? "Editar Dica" : "Nova Dica de Estilo"}
            </h3>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Título</label>
              <input type="text" placeholder="Ex: Como escolher as cores certas" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Descrição</label>
              <textarea placeholder="Descrição da dica..." value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3}
                className="w-full border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Imagem</label>
              {imagem && <img src={imagem} alt="" className="w-full h-28 object-cover rounded-xl mb-2 border border-border" />}
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl p-3 hover:bg-muted/40 transition-colors">
                {uploading ? <RefreshCw size={14} className="text-muted-foreground animate-spin" /> : <Image size={14} className="text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">{uploading ? "A enviar..." : "Clique para escolher imagem"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} disabled={uploading} />
              </label>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Dicas (passos)</label>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Adicionar dica..." value={dicaInput} onChange={(e) => setDicaInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddDica(); } }}
                  className="flex-1 border border-black rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black" />
                <button onClick={handleAddDica} className="px-4 py-2 bg-muted text-foreground font-semibold text-xs rounded-xl hover:bg-border transition-colors">Add</button>
              </div>
              <div className="space-y-1.5">
                {dicasList.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg text-xs">
                    <span className="font-bold text-muted-foreground">{i + 1}.</span>
                    <span className="flex-1">{d}</span>
                    <button onClick={() => handleRemoveDica(d)} className="text-foreground/70 hover:text-red-500 transition-colors"><X size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setShowAdd(false); setEditId(null); resetForm(); }}
                className="px-4 py-2 border border-black rounded-full hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={!titulo.trim() || !descricao.trim() || saving}
                className="px-4 py-2 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-1.5">
                {saving ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />} Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CARRINHOS ACCESS
// ═══════════════════════════════════════════════════════════════════════
function CarrinhosAccessSection() {
  const [pendingStores, setPendingStores] = useState<any[]>([]);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "all">("pending");

  useEffect(() => {
    fetchPending();
    fetchAll();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/stores/carrinho-access/pending");
      const data = await res.json();
      setPendingStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar pedidos pendentes:", err);
      setPendingStores([]);
    }
  };

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/stores/admin/all");
      const data = await res.json();
      setAllStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar lojas:", err);
      setAllStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccess = async (storeId: string, status: string) => {
    try {
      await fetch(`/api/stores/${storeId}/carrinho-access`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchPending();
      fetchAll();
    } catch (err) {
      console.error("Erro ao atualizar acesso:", err);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Acesso ao Carrinho</h3>
      
      <div className="flex gap-2 border-b border-black pb-2">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
            tab === "pending" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pendentes ({pendingStores.length})
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
            tab === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Todas as Lojas
        </button>
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          {pendingStores.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum pedido pendente.</p>
          ) : (
            pendingStores.map((store) => (
              <div key={store.id} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div>
                  <p className="text-sm font-semibold">{store.name}</p>
                  <p className="text-xs text-muted-foreground">Proprietário: {store.ownerName} ({store.ownerPhone})</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccess(store.id, "APROVADO")}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <Check size={12} /> Aprovar
                  </button>
                  <button
                    onClick={() => handleAccess(store.id, "RECUSADO")}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Recusar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "all" && (
        <div className="space-y-2">
          {allStores.map((store) => (
            <div key={store.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3">
              <div>
                <p className="text-sm font-medium">{store.name}</p>
                <p className="text-xs text-muted-foreground">{store.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  store.carrinhoAccess === "APROVADO" ? "bg-green-100 text-green-700" :
                  store.carrinhoAccess === "RECUSADO" ? "bg-red-100 text-red-700" :
                  store.carrinhoAccess === "PENDENTE" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {store.carrinhoAccess === "NAO_SOLICITADO" ? "Não solicitado" :
                   store.carrinhoAccess === "APROVADO" ? "Aprovado" :
                   store.carrinhoAccess === "RECUSADO" ? "Recusado" :
                   store.carrinhoAccess === "PENDENTE" ? "Pendente" : "Não solicitado"}
                </span>
                <select
                  value={store.carrinhoAccess || "NAO_SOLICITADO"}
                  onChange={(e) => handleAccess(store.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="NAO_SOLICITADO">Não solicitado</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="RECUSADO">Recusado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
