import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import {
  Check, X, ShieldAlert, Ban, Info, Phone, Search,
  KeyRound, Tag, Edit2, RefreshCw,
} from "lucide-react";
import {
  fetchAdminUsersFiltered, approveLojista, rejectLojista, suspendLojista, reactivateLojista, resetUserPassword,
} from "@/lib/api";

type MainTab = "contas" | "categorias";
type AccountTab = "PENDENTE" | "APROVADO" | "DESATIVADO";

const LOVE_SERVICE_GROUPS = [
  { number: "01", title: "Actos de Amor, Homenagens e Experiências", category: "actos-de-amor", items: ["Presentes e buquês", "Cartas escritas à mão", "Serenatas e músicos", "Festas íntimas"] },
  { number: "02", title: "Fotografia e Videomakers", category: "fotografia", items: ["Fotógrafos", "Videomakers"] },
  { number: "03", title: "Saúde, Cuidado e Bem-Estar ao Domicílio", category: "saude", items: ["Enfermagem e médicos", "Fisioterapia e massagens", "Apoio psicológico", "Personal trainers"] },
  { number: "04", title: "Gestão do Lar e Refeições", category: "lar", items: ["Cozinheiras e meal prep", "Personal organizers", "Limpeza profunda", "Assistente de compras"] },
  { number: "05", title: "Burocracias", category: "burocracias", items: ["Pendências diárias", "Filas", "Entregas urgentes"] },
];

const inputCls = "w-full border border-[#d1d4d8] bg-white py-3 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#d96f5c] focus:ring-2 focus:ring-[#d96f5c]/10 transition-all rounded-xl";
const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-1.5";

export function LoveAdminPanel() {
  const [mainTab, setMainTab] = useState<MainTab>("contas");

  return (
    <PageTransition>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#30343a] flex items-center gap-2">
            <ShieldAlert size={24} /> Administração Love Services
          </h1>
          <p className="text-sm text-[#87909a] mt-1">
            Gerencie contas e categorias da Eliora Love Services
          </p>
        </div>

        <div className="flex border-b border-[#d1d4d8] gap-1">
          {([
            { id: "contas" as MainTab, label: "Contas", icon: <Phone size={13} /> },
            { id: "categorias" as MainTab, label: "Categorias de Serviços", icon: <Tag size={13} /> },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id)}
              className={`pb-3 px-5 text-xs font-semibold uppercase tracking-wider relative transition-colors flex items-center gap-1.5 ${
                mainTab === t.id
                  ? "text-[#30343a] font-bold"
                  : "text-[#87909a] hover:text-[#30343a]"
              }`}
            >
              {t.icon} {t.label}
              {mainTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30343a]" />}
            </button>
          ))}
        </div>

        {mainTab === "contas" && <ContasSection />}
        {mainTab === "categorias" && <CategoriasSection />}
      </div>
    </PageTransition>
  );
}

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
    try { setUsers(await fetchAdminUsersFiltered("love-services")); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    try { await approveLojista(id); loadUsers(); }
    catch { alert("Erro ao aprovar."); }
  }

  async function handleRejectSubmit() {
    if (!rejectId) return;
    try { await rejectLojista(rejectId, rejectReason); setRejectId(null); setRejectReason(""); loadUsers(); }
    catch { alert("Erro ao recusar."); }
  }

  async function handleSuspendSubmit() {
    if (!suspendId) return;
    try { await suspendLojista(suspendId, suspendReason); setSuspendId(null); setSuspendReason(""); loadUsers(); }
    catch { alert("Erro ao suspender."); }
  }

  async function handleReactivate(id: string) {
    try { await reactivateLojista(id); loadUsers(); }
    catch { alert("Erro ao reativar."); }
  }

  async function handleResetPassword(id: string) {
    try {
      await resetUserPassword(id);
      setResetId(null);
      alert("Senha redefinida para 123456789.");
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
        || (u.storeName || "").toLowerCase().includes(term);
    });

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar utilizadores...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "PENDENTE", label: "Pendentes" },
          { id: "APROVADO", label: "Ativas" },
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
                activeTab === t.id ? "bg-[#173a42] text-white border-[#173a42]" : "border-[#d1d4d8] text-[#87909a] hover:border-[#173a42] hover:text-[#30343a]"
              }`}>
              {t.label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87909a]" />
        <input type="text" placeholder="Pesquisar por nome, telefone, loja..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-[#d1d4d8] rounded-2xl pl-9 pr-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-[#173a42] bg-white" />
      </div>

      <div className="space-y-3">
        {filtered.map((user) => (
          <div key={user.id} className="border border-[#d1d4d8] rounded-2xl p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#f0f0f0] flex-shrink-0">
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
                <p className="text-xs text-[#87909a] flex items-center gap-1"><Phone size={11} />{user.phone}</p>
                <p className="text-xs text-[#87909a]"><strong>Loja:</strong> {user.storeName || `Loja de ${user.name}`}</p>
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
              <button onClick={() => setResetId(user.id)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors" title="Redefinir senha para 123456789">
                <KeyRound size={12} />Reset Senha
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhum utilizador encontrado.</p>
        )}
      </div>

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#d1d4d8] shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Info size={16} className="text-red-500" />Motivo da Recusa</h3>
            <textarea placeholder="Motivo detalhado..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full border border-[#d1d4d8] rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-[#173a42]" />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="px-4 py-2 border border-[#d1d4d8] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={handleRejectSubmit} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50">Confirmar Recusa</button>
            </div>
          </div>
        </div>
      )}

      {suspendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#d1d4d8] shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Info size={16} className="text-amber-500" />Motivo da Suspensão</h3>
            <textarea placeholder="Motivo detalhado..." value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={4} className="w-full border border-[#d1d4d8] rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-[#173a42]" />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setSuspendId(null); setSuspendReason(""); }} className="px-4 py-2 border border-[#d1d4d8] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={handleSuspendSubmit} disabled={!suspendReason.trim()} className="px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50">Confirmar Suspensão</button>
            </div>
          </div>
        </div>
      )}

      {resetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#d1d4d8] shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><KeyRound size={16} className="text-blue-500" />Redefinir Senha</h3>
            <p className="text-xs text-[#87909a]">A senha será redefinida para <strong>123456789</strong>.</p>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setResetId(null)} className="px-4 py-2 border border-[#d1d4d8] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={() => handleResetPassword(resetId)} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">Confirmar Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriasSection() {
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editItems, setEditItems] = useState<string[]>([]);
  const [editItemInput, setEditItemInput] = useState("");

  function startEdit(g: typeof LOVE_SERVICE_GROUPS[0]) {
    setEditId(g.category);
    setEditTitle(g.title);
    setEditItems(g.items);
    setEditItemInput("");
  }

  function handleAddItem() {
    if (!editItemInput.trim()) return;
    if (!editItems.includes(editItemInput.trim())) {
      setEditItems([...editItems, editItemInput.trim()]);
    }
    setEditItemInput("");
  }

  function handleRemoveItem(item: string) {
    setEditItems(editItems.filter(i => i !== item));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#87909a]">{LOVE_SERVICE_GROUPS.length} categorias de serviços</p>

      <div className="space-y-3">
        {LOVE_SERVICE_GROUPS.map((g) => (
          <div key={g.category} className="border border-[#d1d4d8] rounded-2xl p-4 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#87909a] font-mono">#{g.number} · {g.category}</p>
                <p className="text-sm font-semibold mt-0.5">{g.title}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {g.items.map((item) => (
                    <span key={item} className="text-[10px] bg-[#f0f0f0] text-[#30343a] px-2 py-0.5 rounded-full border border-[#d1d4d8]">{item}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => startEdit(g)} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#d1d4d8] hover:bg-[#f0f0f0] transition-colors flex-shrink-0">
                <Edit2 size={12} /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#d1d4d8] shadow-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><Tag size={16} /> Editar Categoria</h3>

            <div>
              <label className={labelCls}>Título</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Serviços (subcategorias)</label>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Adicionar serviço..." value={editItemInput} onChange={(e) => setEditItemInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddItem(); } }}
                  className="flex-1 border border-[#d1d4d8] rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#173a42]" />
                <button onClick={handleAddItem} className="px-4 py-2 bg-[#f0f0f0] text-[#30343a] font-semibold text-xs rounded-xl hover:bg-[#d1d4d8] transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {editItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 bg-[#f0f0f0] px-2.5 py-1 rounded-md text-xs font-medium border border-[#d1d4d8]">
                    {item} <button onClick={() => handleRemoveItem(item)} className="text-[#87909a] hover:text-red-500 transition-colors flex items-center justify-center p-0.5"><X size={13}/></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setEditId(null)} className="px-4 py-2 border border-[#d1d4d8] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={() => { alert("Categorias geridas localmente no código."); setEditId(null); }}
                className="px-4 py-2 bg-[#173a42] text-white rounded-full hover:bg-[#0f2a30] transition-colors flex items-center gap-1.5">
                <Check size={12} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
