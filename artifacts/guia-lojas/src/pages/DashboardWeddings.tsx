import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStoreById, updateStore, createProduct, deleteProduct, updateProduct, changePassword, uploadImage, fetchAdminUsersFiltered, resetUserPassword } from "@/lib/api";
import { WeddingAdminPanel } from "@/components/WeddingAdminPanel";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { LogOut, Eye, MessageCircle, Edit2, Trash2, Plus, X, Store, Package, KeyRound, EyeOff, Camera, Image, ShieldAlert, Phone, RefreshCw, LayoutDashboard, Menu } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

type Section = "overview" | "loja" | "produtos" | "contactos" | "admin" | "pagina-inicial";

const inputCls = "w-full border border-[#d1d4d8] bg-white py-3 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#2c3035] focus:ring-2 focus:ring-[#2c3035]/10 transition-all rounded-xl";
const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-1.5";

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

interface DaySchedule {
  label: string;
  closed: boolean;
  open: string;
  close: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { label: "Segunda a Sexta", closed: false, open: "08:00", close: "18:00" },
  { label: "Sábado", closed: false, open: "09:00", close: "14:00" },
  { label: "Domingo", closed: true, open: "08:00", close: "18:00" },
];

function TimeSelect({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${inputCls} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

const WEDDING_SERVICE_GROUPS = [
  {
    number: "01",
    title: "Planeamento & Organização de Casamentos",
    intro: "Do primeiro sim ao último brinde, guardamos o fio invisível de tudo.",
    items: ["Wedding Planner & Assessoria do Evento", "Assistente Pessoal dos Noivos", "Weddings & Mini-Weddings", "Mestre de Cerimónias", "Hostesses e Acolhimento VIP"],
    category: "planeamento",
  },
  {
    number: "02",
    title: "Pedidos de Casamento, Noivados & Momentos Românticos",
    intro: "Gestos íntimos, pensados para a vossa história e para aquele instante único.",
    items: ["Criador de Pedidos de Casamento", "Aniversários de Namoro/Casamento", "Chefs ao Domicílio para Jantares Íntimos", "Serenatas e Músicos para Pedidos"],
    category: "noivados",
  },
  {
    number: "03",
    title: "Fotografia, Vídeo & Produção Audiovisual",
    intro: "A memória viva de cada detalhe, feita para durar gerações.",
    items: ["Fotógrafo de Casamento", "Videógrafo & Cinematografia", "Drone & Cobertura Aérea", "Aftermovie & Edição Cinematográfica", "Álbuns & Livros de Fotos"],
    category: "fotografia",
  },
  {
    number: "04",
    title: "Beleza & Estilismo para Noivas e Noivos",
    intro: "A vossa melhor versão, sentida e vista.",
    items: ["Maquilhagem Profissional para Noivas", "Penteado & Hair Styling", "Estilista Pessoal & Consultoria de Imagem", "Tratamentos de Pele e Corpo", "Grooming & Barba para Noivos"],
    category: "beleza",
  },
  {
    number: "05",
    title: "Decoração, Flores & Experiências",
    intro: "O cenário, os sabores e o ritmo que fazem cada celebração ganhar alma.",
    items: ["Locais e Espaços para Eventos", "Design Floral & Decoração Temática", "Catering, Bolos de Noiva e Bar de Cocktails", "DJs, Bandas e Entretenimento"],
    category: "decoracao",
  },
];

export default function DashboardWeddings() {
  const [loc, setLoc] = useLocation();
  const queryClient = useQueryClient();
  const localUserStr = localStorage.getItem("guialocal_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  const isAdmin = localUser?.phone === "999999999";

  useEffect(() => {
    if (!localUser) setLoc("/login-weddings");
  }, [localUser, setLoc]);

  useEffect(() => {
    if (!localUser || localUser.status === "APROVADO") return;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/status/${localUser.id}`);
        const data = await res.json();
        if (data.status && data.status !== localUser.status) {
          const updated = { ...localUser, status: data.status, statusReason: data.statusReason };
          localStorage.setItem("guialocal_user", JSON.stringify(updated));
          window.location.reload();
        }
      } catch {}
    }, 3000);
    return () => clearTimeout(t);
  }, [localUser]);

  // Verificar status pendente
  const handleRefreshStatus = async () => {
    try {
      const res = await fetch(`/api/auth/status/${localUser.id}`);
      const data = await res.json();
      const updated = { ...localUser, status: data.status, statusReason: data.statusReason };
      localStorage.setItem("guialocal_user", JSON.stringify(updated));
      window.location.reload();
    } catch {}
  };

  if (!localUser) return null;

  if (!isAdmin && localUser.status === "PENDENTE") {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500">
              <ShieldAlert size={28} />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-[#30343a]">Pedido de Conta Pendente</h1>
              <p className="text-sm text-[#87909a]">A sua conta está em análise pela equipa de administração.</p>
            </div>
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-4 text-xs text-amber-800 text-left space-y-2.5">
              <p className="font-semibold flex items-center gap-1.5">O que acontece agora?</p>
              <p>Assim que o administrador aprovar a sua solicitação, poderá aceder ao painel e gerenciar os seus serviços.</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={handleRefreshStatus} className="w-full bg-[#2c3035] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-[#1a1d20] transition-colors flex items-center justify-center gap-1.5">
                <RefreshCw size={13} /> Atualizar Status
              </button>
              <a href="/login-weddings" className="w-full border border-[#d1d4d8] text-[#87909a] hover:bg-[#f0f0f0] py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                Voltar ao Login
              </a>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const [section, setSection] = useState<Section>(isAdmin ? "admin" : "overview");
  const [isDirty, setIsDirty] = useState(false);
  const saveFnRef = useRef<(() => void) | null>(null);

  const [showChangePwd, setShowChangePwd] = useState(!!localUser?.mustChangePassword);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  async function handleForceChangePwd() {
    setPwdError("");
    if (newPwd.length < 6) { setPwdError("Mínimo 6 caracteres."); return; }
    if (newPwd !== confirmPwd) { setPwdError("Senhas não coincidem."); return; }
    setPwdLoading(true);
    try {
      await changePassword(localUser.id, newPwd);
      localStorage.setItem("guialocal_user", JSON.stringify({ ...localUser, mustChangePassword: false }));
      setShowChangePwd(false);
    } catch (e: any) { setPwdError(e.message); } finally { setPwdLoading(false); }
  }

  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", handle);
    return () => window.removeEventListener("beforeunload", handle);
  }, [isDirty]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (s: Section) => {
    if (isDirty && !window.confirm("Sair sem salvar?")) return;
    setIsDirty(false);
    setSection(s);
    setMobileMenuOpen(false);
  };

  const { data: store, isLoading } = useQuery({
    queryKey: ["myStore", localUser?.storeId],
    queryFn: () => fetchStoreById(localUser.storeId),
    enabled: !!localUser?.storeId && !isAdmin,
  });

  const handleLogout = () => {
    localStorage.removeItem("guialocal_user");
    window.location.href = "/";
  };

  if (!localUser) return null;

  const sidebarItems = [
    ...(isAdmin ? [
      { id: "overview" as Section, label: "Redefinir Senhas", icon: <KeyRound size={15} /> },
      { id: "admin" as Section, label: "Administração", icon: <ShieldAlert size={15} /> },
    ] : [
      { id: "overview" as Section, label: "Visão Geral", icon: <Eye size={15} /> },
      { id: "loja" as Section, label: "Minha Loja", icon: <Store size={15} /> },
      { id: "produtos" as Section, label: "Serviços", icon: <Package size={15} /> },
      { id: "contactos" as Section, label: "Contactos", icon: <MessageCircle size={15} /> },
    ]),
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fafafa]"><p className="text-sm text-[#87909a]">Carregando...</p></div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fafafa] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        `}</style>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#2c3035] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-yesola-icon.png" alt="YESOLA" className="w-7 h-7" />
            <span className="font-serif text-sm tracking-[0.08em]">YESOLA <i className="font-normal">Casamentos</i></span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 z-30 w-64 bg-[#2c3035] text-white h-screen p-4 flex flex-col overflow-y-auto transition-transform duration-300`}>
          <div className="flex items-center gap-3 mb-5">
            <img src="/logo-yesola-icon.png" alt="YESOLA" className="w-8 h-8" />
            <div>
              <p className="font-serif text-sm tracking-[0.08em]">YESOLA <i className="font-normal">Casamentos</i></p>
              <p className="text-[10px] text-white/50">Painel da loja</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-2"
            >
              <Eye size={15} />
              Ver site
            </button>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${
                  section === item.id ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2 pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => { localStorage.removeItem("eliora-selected-store"); window.location.href = "/"; }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <Store size={15} />
              Trocar loja
            </button>
            <button
              onClick={() => setShowChangePwd(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <KeyRound size={15} />
              Alterar senha
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8 overflow-y-auto">
          {section === "overview" && !isAdmin && store && <OverviewSection store={store} />}
          {section === "overview" && isAdmin && <AdminOverviewSection />}
          {section === "admin" && <WeddingAdminPanel />}
          {section === "pagina-inicial" && <PageContentEditor />}
          {section === "loja" && store && <LojaSection store={store} isDirty={isDirty} setDirty={setIsDirty} saveFnRef={saveFnRef} />}
          {section === "produtos" && store && <ProdutosSection store={store} />}
          {section === "contactos" && store && <ContactosSection store={store} />}
        </main>
      </div>

      {/* Modal alterar senha */}
      <AnimatePresence>
        {showChangePwd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-8 max-w-sm w-full">
              <h3 className="font-serif text-xl text-[#30343a] mb-4">Alterar senha</h3>
              {pwdError && <p className="text-xs text-red-500 mb-3">{pwdError}</p>}
              <div className="space-y-3">
                <div className="relative">
                  <input type={showNewPwd ? "text" : "password"} placeholder="Nova senha" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={`${inputCls} pr-8`} />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-3 text-[#87909a]">{showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
                <div className="relative">
                  <input type={showConfirmPwd ? "text" : "password"} placeholder="Confirmar senha" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={`${inputCls} pr-8`} />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-3 text-[#87909a]">{showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleForceChangePwd} disabled={pwdLoading} className="flex-1 bg-[#2c3035] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#1a1d20] transition-colors">
                  {pwdLoading ? "A guardar..." : "Guardar"}
                </button>
                {!localUser?.mustChangePassword && (
                  <button onClick={() => setShowChangePwd(false)} className="flex-1 border border-[#d1d4d8] py-3 rounded-xl text-sm text-[#87909a] hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

/* ── Admin Overview — Pedidos de definir novas senhas ──────── */
function AdminOverviewSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetId, setResetId] = useState<number | null>(null);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const all = await fetchAdminUsersFiltered("weddings");
      setUsers(all.filter((u: any) => u.phone !== "999999999" && (u.status === "APROVADO" || u.status === "PENDENTE")));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleReset(id: number) {
    try {
      await resetUserPassword(id);
      setResetId(null);
      alert("Senha redefinida para 123456789.");
      loadUsers();
    } catch { alert("Erro ao redefinir senha."); }
  }

  const pendingCount = users.filter(u => u.status === "PENDENTE").length;

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-[#30343a] flex items-center gap-2">
          <KeyRound size={20} /> Pedidos de definir novas senhas
        </h2>
        <p className="text-sm text-[#87909a] mt-1">
          Utilizadores activos que podem precisar de redefinir senha.
          {pendingCount > 0 && <span className="ml-2 text-amber-600 font-medium">({pendingCount} pendente(s) de aprovação)</span>}
        </p>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="border border-[#d1d4d8] rounded-2xl p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f0f0f0] flex-shrink-0 flex items-center justify-center">
                <Phone size={18} className="text-[#87909a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold">{u.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    u.status === "APROVADO" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}>{u.status}</span>
                </div>
                <p className="text-xs text-[#87909a]">{u.phone}</p>
                <p className="text-xs text-[#87909a]">Loja: {u.storeName || "—"}</p>
              </div>
            </div>
            <button
              onClick={() => setResetId(u.id)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              title="Redefinir senha para 123456789"
            >
              <KeyRound size={12} /> Reset Senha
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-center text-sm text-[#87909a] py-8 border border-dashed rounded-2xl">Nenhum utilizador encontrado.</p>
        )}
      </div>

      {resetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#d1d4d8] shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5"><KeyRound size={16} className="text-blue-500" /> Redefinir Senha</h3>
            <p className="text-xs text-[#87909a]">A senha será redefinida para <strong>123456789</strong>.</p>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setResetId(null)} className="px-4 py-2 border border-[#d1d4d8] rounded-full hover:bg-[#f0f0f0] transition-colors">Cancelar</button>
              <button onClick={() => handleReset(resetId)} className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">Confirmar Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Overview ──────────────────────────────────────────── */
function OverviewSection({ store }: { store: any }) {
  const stats = [
    { label: "Serviços", value: store.products?.length || 0, icon: <Package size={18} /> },
  ];
  return (
    <div>
      <h2 className="font-serif text-3xl text-[#30343a] mb-8">Visão Geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e8eaed] p-6">
            <div className="flex items-center gap-3 mb-3 text-[#87909a]">{s.icon}<span className="text-xs uppercase tracking-wider">{s.label}</span></div>
            <p className="text-3xl font-semibold text-[#30343a]">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Loja ──────────────────────────────────────────────── */
function LojaSection({ store, isDirty, setDirty, saveFnRef }: { store: any; isDirty: boolean; setDirty: (v: boolean) => void; saveFnRef: React.MutableRefObject<(() => void) | null> }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: store.name || "", description: store.description || "", phone: store.phone || "", address: store.address || "", province: store.province || "", municipality: store.municipality || "" });
  const [schedule, setSchedule] = useState<DaySchedule[]>(store.schedule || DEFAULT_SCHEDULE);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => updateStore(store.id, { ...store, ...form, schedule }),
    onSuccess: () => { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 2000); queryClient.invalidateQueries({ queryKey: ["myStore"] }); },
  });

  const handleChange = (field: string, value: string) => { setForm((prev) => ({ ...prev, [field]: value })); setDirty(true); };
  const handleSave = () => mutation.mutate();
  saveFnRef.current = handleSave;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "coverImage" | "coverImages") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await uploadImage(base64, `${store.id}-${field}`);
        if (field === "coverImages") {
          const currentImages = store.coverImages || [];
          await updateStore(store.id, { ...store, coverImages: [...currentImages, res.imageUrl] });
        } else {
          await updateStore(store.id, { ...store, [field]: res.imageUrl });
        }
        queryClient.invalidateQueries({ queryKey: ["myStore"] });
        setUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(null);
    }
  };

  const handleRemoveCoverImage = async (index: number) => {
    const currentImages = store.coverImages || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    await updateStore(store.id, { ...store, coverImages: newImages });
    queryClient.invalidateQueries({ queryKey: ["myStore"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl text-[#30343a]">Minha Loja</h2>
        {isDirty && (
          <button onClick={handleSave} disabled={mutation.isPending} className="bg-[#2c3035] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a1d20] transition-colors">
            {mutation.isPending ? "A guardar..." : "Guardar alterações"}
          </button>
        )}
        {saved && <span className="text-xs text-green-600 font-medium">Guardado!</span>}
      </div>

      {/* Imagens */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 space-y-6 max-w-2xl mb-6">
        <h3 className="font-serif text-lg text-[#30343a]">Imagens</h3>
        
        {/* Logo */}
        <div>
          <label className={labelCls}>Logo da loja</label>
          <div className="flex items-center gap-4">
            {store.logoUrl && <img src={store.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-[#e8eaed]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#2c3035] hover:text-[#30343a] cursor-pointer transition-colors">
              <Camera size={14} />
              {uploading === "logoUrl" ? "A enviar..." : store.logoUrl ? "Trocar logo" : "Adicionar logo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} disabled={uploading !== null} />
            </label>
          </div>
        </div>

        {/* Cover */}
        <div>
          <label className={labelCls}>Imagem de capa</label>
          <div className="flex items-center gap-4">
            {store.coverImage && <img src={store.coverImage} alt="Capa" className="w-32 h-20 rounded-xl object-cover border border-[#e8eaed]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#2c3035] hover:text-[#30343a] cursor-pointer transition-colors">
              <Image size={14} />
              {uploading === "coverImage" ? "A enviar..." : store.coverImage ? "Trocar capa" : "Adicionar capa"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImage")} disabled={uploading !== null} />
            </label>
          </div>
        </div>

        {/* Galeria */}
        <div>
          <label className={labelCls}>Galeria de imagens</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {(store.coverImages || []).map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Galeria ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-[#e8eaed]" />
                <button
                  onClick={() => handleRemoveCoverImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border border-dashed border-[#d1d4d8] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#87909a] hover:border-[#2c3035] hover:text-[#30343a] cursor-pointer transition-colors">
              <Camera size={16} className="mb-1" />
              {uploading === "coverImages" ? "..." : "Adicionar"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImages")} disabled={uploading !== null} />
            </label>
          </div>
        </div>
      </div>

      {/* Dados */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 space-y-6 max-w-2xl">
        <h3 className="font-serif text-lg text-[#30343a]">Dados da loja</h3>
        <div><label className={labelCls}>Nome da loja</label><input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Descrição</label><textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Telefone</label><input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Endereço</label><input value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Província</label>
            <select value={form.province} onChange={(e) => { handleChange("province", e.target.value); handleChange("municipality", ""); }} className={`${inputCls} cursor-pointer`}>
              <option value="">Selecione a Província</option>
              {ANGOLA_PROVINCES.map((p) => (
                <option key={p.name} value={p.name} className="bg-white text-[#30343a]">{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Município</label>
            <select value={form.municipality} onChange={(e) => handleChange("municipality", e.target.value)} className={`${inputCls} cursor-pointer disabled:opacity-50`} disabled={!form.province}>
              <option value="">{form.province ? "Selecione o Município" : "Selecione a província primeiro"}</option>
              {(ANGOLA_PROVINCES.find((p) => p.name === form.province)?.municipalities || []).map((m) => (
                <option key={m} value={m} className="bg-white text-[#30343a]">{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Horários */}
        <div>
          <label className={labelCls}>Horários de funcionamento</label>
          <div className="space-y-3">
            {schedule.map((day, i) => (
              <div key={day.label} className="border border-[#e8eaed] rounded-2xl p-4 bg-[#fafafa]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#30343a]">{day.label}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      day.closed ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}>
                      {day.closed ? "Fechado" : "Aberto"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, closed: !d.closed } : d)); setDirty(true); }}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer ${
                      !day.closed ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${!day.closed ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className={`grid grid-cols-2 gap-3 transition-all duration-200 ${day.closed ? "opacity-50 pointer-events-none" : ""}`}>
                  <div>
                    <p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Abertura</p>
                    <TimeSelect value={day.open} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, open: v } : d)); setDirty(true); }} disabled={day.closed} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Fechamento</p>
                    <TimeSelect value={day.close} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, close: v } : d)); setDirty(true); }} disabled={day.closed} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Produtos / Serviços ───────────────────────────────── */
function ProdutosSection({ store }: { store: any }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const createMut = useMutation({
    mutationFn: () => {
      if (editProduct) {
        return updateProduct(editProduct.id, {
          ...form,
          price: Number(form.price) || 0,
          imageUrl: productImages[0] || "",
          imageUrls: productImages,
        });
      }
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const selectedGroup = WEDDING_SERVICE_GROUPS.find((g) => g.title === form.category);
      return createProduct({
        id,
        ...form,
        category: selectedGroup ? selectedGroup.title : form.category,
        price: Number(form.price) || 0,
        storeId: store.id,
        imageUrl: productImages[0] || "",
        imageUrls: productImages,
      });
    },
    onSuccess: () => { setShowForm(false); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); queryClient.invalidateQueries({ queryKey: ["myStore"] }); },
    onError: (error: Error) => { console.error("Erro ao guardar serviço:", error.message); alert("Erro ao guardar: " + error.message); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myStore"] }),
  });

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = 5 - productImages.length;
    if (remaining <= 0) { alert("Máximo de 5 imagens por serviço."); return; }
    const toUpload = Array.from(files).slice(0, remaining);
    if (files.length > remaining) { alert(`Só pode adicionar mais ${remaining} imagem(ns).`); }
    setUploadingImg(true);
    try {
      for (const file of toUpload) {
        const res = await new Promise<{ imageUrl: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const imgRes = await uploadImage(reader.result as string, `product-${Date.now()}-${Math.random().toString(36).slice(2)}`);
              resolve(imgRes);
            } catch (err) { reject(err); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setProductImages((prev) => [...prev, res.imageUrl]);
      }
      setUploadingImg(false);
    } catch (err) {
      setUploadingImg(false);
    }
    e.target.value = "";
  };

  const removeProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const products = store.products || [];

  const getProductsForGroup = (category: string) => {
    return products.filter((p: any) => p.category?.toLowerCase().includes(category.toLowerCase()));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl text-[#30343a]">Serviços</h2>
        <button onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); }} className="flex items-center gap-2 bg-[#2c3035] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a1d20] transition-colors">
          <Plus size={15} /> Novo serviço
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
            <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#30343a]">{editProduct ? "Editar serviço" : "Novo serviço"}</h3>
                <button onClick={() => { setShowForm(false); setEditProduct(null); setForm({ name: "", price: "", category: "", subcategory: "", description: "" }); setProductImage(""); }} className="text-[#87909a] hover:text-[#30343a]"><X size={18} /></button>
              </div>

              {/* Imagens do produto */}
              <div>
                <label className={labelCls}>Imagens do serviço (até 5)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {productImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Imagem ${i + 1}`} className="w-20 h-20 rounded-xl object-cover border border-[#e8eaed]" />
                      <button
                        onClick={() => removeProductImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {productImages.length < 5 && (
                    <label className="w-20 h-20 border border-dashed border-[#d1d4d8] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#87909a] hover:border-[#2c3035] hover:text-[#30343a] cursor-pointer transition-colors">
                      <Camera size={16} className="mb-1" />
                      {uploadingImg ? "..." : "Adicionar"}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductImageUpload} disabled={uploadingImg} />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-[#87909a]">{productImages.length}/5 imagens</p>
              </div>

              <div><label className={labelCls}>Nome</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Ex: Wedding Planner" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Preço</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Moeda</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls}>
                    <option value="AOA">AOA (Kz)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Categoria</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    <option value="">Selecionar categoria...</option>
                    {WEDDING_SERVICE_GROUPS.map((group) => (
                      <option key={group.category} value={group.title}>{group.number} — {group.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Subcategoria</label>
                <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className={inputCls} disabled={!form.category}>
                  <option value="">Selecionar subcategoria...</option>
                  {WEDDING_SERVICE_GROUPS.find((g) => g.title === form.category)?.items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div><label className={labelCls}>Descrição</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} /></div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending || !form.name} className="bg-[#2c3035] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a1d20] transition-colors disabled:opacity-50">
                {createMut.isPending ? "A guardar..." : editProduct ? "Atualizar" : "Guardar"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Groups */}
      <div className="space-y-6">
        {WEDDING_SERVICE_GROUPS.filter((group) => {
          const groupProducts = getProductsForGroup(group.category);
          return groupProducts.length > 0;
        }).map((group) => {
          const groupProducts = getProductsForGroup(group.category);
          const isExpanded = selectedGroup === group.category;
          return (
            <div key={group.category} className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
              <button
                onClick={() => setSelectedGroup(isExpanded ? null : group.category)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#30343a]">{group.title}</h4>
                    <p className="text-xs text-[#87909a] mt-0.5">{groupProducts.length} serviço(s)</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#87909a] transition-transform ${isExpanded ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {isExpanded && (
                <div className="border-t border-[#e8eaed] p-5">
                  <p className="text-xs text-[#686e76] mb-4">{group.intro}</p>
                  
                  {/* Subcategorias */}
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-2">Subcategorias</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} className="px-3 py-1.5 bg-[#f5f6f7] text-xs text-[#565d66] rounded-full">{item}</span>
                      ))}
                    </div>
                  </div>

                  {/* Serviços adicionados */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#87909a] mb-2">Serviços desta categoria</p>
                    {groupProducts.length === 0 ? (
                      <p className="text-xs text-[#87909a] text-center py-6 bg-[#fafafa] rounded-xl">Nenhum serviço nesta categoria.</p>
                    ) : (
                      <div className="space-y-2">
                        {groupProducts.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-xl">
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />}
                            <div className="flex-1">
                              <h5 className="text-xs font-medium text-[#30343a]">{p.name}</h5>
                              <p className="text-[10px] text-[#87909a]">{p.subcategory || p.category} {p.price ? `· ${p.currency === "USD" ? "$" : p.currency === "EUR" ? "€" : p.currency === "GBP" ? "£" : "Kz"} ${p.price.toLocaleString("pt-AO")}` : ""}</p>
                            </div>
                            <button onClick={() => { setEditProduct(p); setForm({ name: p.name, price: String(p.price || ""), currency: p.currency || "AOA", category: p.category || "", subcategory: p.subcategory || "", description: p.description || "" }); setProductImages(p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : [])); setShowForm(true); }} className="text-[#87909a] hover:text-[#2c3035] transition-colors p-1"><Edit2 size={13} /></button>
                            <button onClick={() => { if (confirm("Eliminar este serviço?")) deleteMut.mutate(p.id); }} className="text-[#87909a] hover:text-red-500 transition-colors p-1"><Trash2 size={13} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Contactos ─────────────────────────────────────────── */
function ContactosSection({ store }: { store: any }) {
  return (
    <div>
      <h2 className="font-serif text-3xl text-[#30343a] mb-8">Contactos</h2>
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 max-w-2xl space-y-6">
        <div>
          <label className={labelCls}>WhatsApp</label>
          <a href={`https://wa.me/244${store.whatsapp || store.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#2c3035] hover:underline">
            <MessageCircle size={16} /> {store.whatsapp || store.phone}
          </a>
        </div>
        <div>
          <label className={labelCls}>Telefone</label>
          <p className="text-sm text-[#30343a]">{store.phone}</p>
        </div>
        <div>
          <label className={labelCls}>Endereço</label>
          <p className="text-sm text-[#30343a]">{store.address || "Não definido"}</p>
        </div>
        <div>
          <label className={labelCls}>WhatsApp Direct</label>
          <a
            href={`https://wa.me/244${store.whatsapp || store.phone}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre a loja ${store.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1da851] transition-colors"
          >
            Enviar mensagem
          </a>
        </div>
      </div>
    </div>
  );
}