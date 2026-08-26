import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStoreById, updateStore, createProduct, deleteProduct, updateProduct, changePassword, uploadImage, fetchAdminUsersFiltered, resetUserPassword } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { LogOut, Eye, MessageCircle, Edit2, Trash2, Plus, X, Store, Package, KeyRound, EyeOff, Camera, ShieldAlert, Phone, RefreshCw, Menu, Image } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { FormacoesAdminPanel } from "@/components/FormacoesAdminPanel";

type Section = "overview" | "loja" | "produtos" | "contactos" | "admin";

const inputCls = "w-full border border-[#d1d4d8] bg-white py-3 px-4 text-sm text-[#123c4a] placeholder:text-[#87909a] outline-none focus:border-[#0c9894] focus:ring-2 focus:ring-[#0c9894]/10 transition-all rounded-xl";
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
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={`${inputCls} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}>
      {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}

const FORMACOES_CATEGORIES = [
  { number: "01", title: "Tecnologia, Programação e Ferramentas Digitais", intro: "Crie o que imagina.", items: ["Programação, Desenvolvimento Web e Criação de Apps", "Informática Básica/Avançada, Pacote Office e Excel", "Ferramentas de Design (Canva, Photoshop) e Edição de Vídeo", "Marketing Digital, Tráfego Pago e Gestão de Redes Sociais"], category: "tecnologia" },
  { number: "02", title: "Desenvolvimento Pessoal, Carreira e Liderança", intro: "Avance com intenção.", items: ["Coaching de Carreira, Orientação Profissional e Transição", "Preparação para Entrevistas de Emprego e Optimização de CV/LinkedIn", "Treinamento em Liderança, Gestão de Equipas e Resolução de Conflitos", "Gestão do Tempo, Produtividade Pessoal e Foco"], category: "carreira" },
  { number: "03", title: "Aulas Práticas, Artes, Música e Hobbies", intro: "Faça acontecer.", items: ["Aulas de Culinária, Confeitaria e Gastronomia", "Canto, Piano, Violão, Guitarra e Outros Instrumentos", "Costura, Modelagem, Corte e Artesanato", "Fotografia Profissional e Produção de Vídeo com Telemóvel"], category: "artes" },
  { number: "04", title: "Saúde, Fitness e Treino Acompanhado", intro: "Cuide do seu ritmo.", items: ["Personal Trainer (Presencial e Online)", "Aulas de Dança, Expressão Corporal e Postura", "Workshops de Nutrição, Reeducação Alimentar e Estilo de Vida", "Aulas de Yoga, Pilates e Treino Funcional"], category: "saude" },
  { number: "05", title: "Idiomas e Comunicação", intro: "Fale com confiança.", items: ["Aulas de Inglês, Francês e Outros Idiomas (Geral e Negócios)", "Comunicação de Alto Impacto, Oratória e Expressão Pública", "Escrita Corporativa, Redação Académica e Preparação de Apresentações"], category: "idiomas" },
  { number: "06", title: "Apoio Académico, Reforço Escolar e Exames", intro: "Aprenda no seu ritmo.", items: ["Explicadores de Matemática, Física, Química e Biologia", "Apoio Escolar Geral e Métodos de Estudo para Crianças e Jovens", "Preparação para Exames de Admissão Universitária e Provas"], category: "academico" },
];

export default function DashboardFormacoes() {
  const [loc, setLoc] = useLocation();
  const queryClient = useQueryClient();
  const localUserStr = localStorage.getItem("guialocal_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  const isAdmin = localUser?.phone === "999999999";

  useEffect(() => {
    if (!localUser) setLoc("/login-formacoes");
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
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500"><ShieldAlert size={28} /></div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-[#123c4a]">Pedido de Conta Pendente</h1>
              <p className="text-sm text-[#87909a]">A sua conta está em análise pela equipa de administração.</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={handleRefreshStatus} className="w-full bg-[#0c9894] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-[#087c7c] transition-colors flex items-center justify-center gap-1.5"><RefreshCw size={13} /> Atualizar Status</button>
              <a href="/login-formacoes" className="w-full border border-[#d1d4d8] text-[#87909a] hover:bg-[#f0f0f0] py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">Voltar ao Login</a>
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
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c9894] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-yesola-icon.png" alt="YESOLA" className="w-7 h-7" />
            <span className="font-serif text-sm tracking-[0.08em]">YESOLA <i className="font-normal">Formações</i></span>
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
        <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 z-30 w-64 bg-[#0c9894] text-white h-screen p-4 flex flex-col overflow-y-auto transition-transform duration-300`}>
          <div className="flex items-center gap-3 mb-5">
            <img src="/logo-yesola-icon.png" alt="YESOLA" className="w-8 h-8" />
            <div>
              <p className="font-serif text-sm tracking-[0.08em]">YESOLA <i className="font-normal">Formações</i></p>
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
          {showChangePwd && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
                <h3 className="text-lg font-bold text-[#123c4a]">Alterar Palavra-passe</h3>
                <div>
                  <label className={labelCls}>Nova Senha</label>
                  <div className="relative">
                    <input type={showNewPwd ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="••••••••" className={`${inputCls} pr-8`} />
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-0 top-2.5 text-[#87909a]">{showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirmar Senha</label>
                  <div className="relative">
                    <input type={showConfirmPwd ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="••••••••" className={`${inputCls} pr-8`} />
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-0 top-2.5 text-[#87909a]">{showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
                <button onClick={handleForceChangePwd} disabled={pwdLoading} className="w-full bg-[#0c9894] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#087c7c] transition-colors disabled:opacity-50">
                  {pwdLoading ? "A alterar..." : "Alterar Senha"}
                </button>
              </div>
            </div>
          )}

          {/* Overview / Password Reset for admin */}
          {section === "overview" && isAdmin && (
            <AdminPasswordReset />
          )}

          {/* Admin panel */}
          {section === "admin" && isAdmin && (
            <FormacoesAdminPanel />
          )}

          {/* Store owner sections */}
          {!isAdmin && section === "overview" && store && (
            <StoreOverview store={store} />
          )}

          {!isAdmin && section === "loja" && store && (
            <StoreEditor store={store} isDirty={isDirty} setIsDirty={setIsDirty} saveFnRef={saveFnRef} />
          )}

          {!isAdmin && section === "produtos" && store && (
            <ProductsManager store={store} />
          )}

          {!isAdmin && section === "contactos" && store && (
            <ContactEditor store={store} isDirty={isDirty} setIsDirty={setIsDirty} saveFnRef={saveFnRef} />
          )}
        </main>
      </div>
    </PageTransition>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function AdminPasswordReset() {
  const localUserStr = localStorage.getItem("guialocal_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetId, setResetId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminUsersFiltered("formacoes").then(setUsers).finally(() => setLoading(false));
  }, []);

  async function handleReset(id: string) {
    try {
      await resetUserPassword(id);
      setResetId(null);
      alert("Senha redefinida para 123456789.");
    } catch { alert("Erro ao redefinir senha."); }
  }

  if (loading) return <div className="text-center py-12 text-sm text-[#87909a]">A carregar...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-[#123c4a] flex items-center gap-2">
          <KeyRound size={20} /> Pedidos de definir novas senhas
        </h2>
        <p className="text-sm text-[#87909a] mt-1">
          Utilizadores activos que podem precisar de redefinir senha.
        </p>
      </div>

      <div className="space-y-3">
        {users.filter((u: any) => u.phone !== "999999999" && (u.status === "APROVADO" || u.status === "PENDENTE")).map((u) => (
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
            >
              <KeyRound size={12} /> Reset Senha
            </button>
          </div>
        ))}
        {users.filter((u: any) => u.phone !== "999999999" && (u.status === "APROVADO" || u.status === "PENDENTE")).length === 0 && (
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

function StoreOverview({ store }: { store: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#123c4a]">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#e8eced] p-5">
          <p className="text-xs text-[#87909a] uppercase tracking-wider mb-1">Estado</p>
          <p className={`text-sm font-semibold ${store.status === "APROVADO" ? "text-green-600" : "text-amber-600"}`}>{store.status || "PENDENTE"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e8eced] p-5">
          <p className="text-xs text-[#87909a] uppercase tracking-wider mb-1">Categoria</p>
          <p className="text-sm font-semibold text-[#123c4a]">{store.category || "-"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e8eced] p-5">
          <p className="text-xs text-[#87909a] uppercase tracking-wider mb-1">Contacto</p>
          <p className="text-sm font-semibold text-[#123c4a]">{store.phone || "-"}</p>
        </div>
      </div>
    </div>
  );
}

function StoreEditor({ store, isDirty, setIsDirty, saveFnRef }: { store: any; isDirty: boolean; setIsDirty: (v: boolean) => void; saveFnRef: React.MutableRefObject<(() => void) | null> }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: store.name || "", description: store.description || "", phone: store.phone || "", address: store.address || "", province: store.province || "", municipality: store.municipality || "" });
  const [schedule, setSchedule] = useState<DaySchedule[]>(store.schedule || DEFAULT_SCHEDULE);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => updateStore(store.id, { ...store, ...form, schedule }),
    onSuccess: () => { setIsDirty(false); setSaved(true); setTimeout(() => setSaved(false), 2000); queryClient.invalidateQueries({ queryKey: ["myStore"] }); },
  });

  useEffect(() => { saveFnRef.current = () => mutation.mutate(); }, [mutation]);

  const selectedProvinceName = form.province;
  const selectedProvince = ANGOLA_PROVINCES.find((p) => p.name === selectedProvinceName);
  const municipalities = selectedProvince ? selectedProvince.municipalities : [];

  const handleChange = (field: string, value: string) => { setForm((f) => ({ ...f, [field]: value })); setIsDirty(true); };

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
    } catch (err) { console.error("Upload error:", err); setUploading(null); }
  };

  const handleRemoveCoverImage = async (index: number) => {
    const currentImages = store.coverImages || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    await updateStore(store.id, { ...store, coverImages: newImages });
    queryClient.invalidateQueries({ queryKey: ["myStore"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#123c4a]">Minha Loja</h2>
        {saved && <span className="text-xs text-green-600 font-medium">Guardado!</span>}
      </div>

      <div className="bg-white rounded-2xl border border-[#e8eced] p-6 space-y-5">
        <h3 className="text-sm font-bold text-[#123c4a]">Imagens</h3>
        <div>
          <label className={labelCls}>Logo da loja</label>
          <div className="flex items-center gap-4">
            {store.logoUrl && <img src={store.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-[#e8eced]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#0c9894] hover:text-[#123c4a] cursor-pointer transition-colors">
              <Camera size={14} />{uploading === "logoUrl" ? "A enviar..." : store.logoUrl ? "Trocar logo" : "Adicionar logo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} disabled={uploading !== null} />
            </label>
          </div>
        </div>
        <div>
          <label className={labelCls}>Imagem de capa</label>
          <div className="flex items-center gap-4">
            {store.coverImage && <img src={store.coverImage} alt="Capa" className="w-32 h-20 rounded-xl object-cover border border-[#e8eced]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#0c9894] hover:text-[#123c4a] cursor-pointer transition-colors">
              <Image size={14} />{uploading === "coverImage" ? "A enviar..." : store.coverImage ? "Trocar capa" : "Adicionar capa"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImage")} disabled={uploading !== null} />
            </label>
          </div>
        </div>
        <div>
          <label className={labelCls}>Galeria de imagens</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {(store.coverImages || []).map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Galeria ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-[#e8eced]" />
                <button onClick={() => handleRemoveCoverImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
            ))}
            <label className="w-24 h-24 border border-dashed border-[#d1d4d8] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#87909a] hover:border-[#0c9894] hover:text-[#123c4a] cursor-pointer transition-colors">
              <Camera size={16} className="mb-1" />{uploading === "coverImages" ? "..." : "Adicionar"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImages")} disabled={uploading !== null} />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8eced] p-6 space-y-5">
        <h3 className="text-sm font-bold text-[#123c4a]">Dados da loja</h3>
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
              {ANGOLA_PROVINCES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Município</label>
            <select value={form.municipality} onChange={(e) => handleChange("municipality", e.target.value)} className={`${inputCls} cursor-pointer disabled:opacity-50`} disabled={!form.province}>
              <option value="">{form.province ? "Selecione o Município" : "Selecione a província primeiro"}</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8eced] p-6 space-y-5">
        <h3 className="text-sm font-bold text-[#123c4a]">Horários de funcionamento</h3>
        <div className="space-y-3">
          {schedule.map((day, i) => (
            <div key={day.label} className="border border-[#e8eced] rounded-2xl p-4 bg-[#fafafa]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#123c4a]">{day.label}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${day.closed ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>{day.closed ? "Fechado" : "Aberto"}</span>
                </div>
                <button type="button" onClick={() => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, closed: !d.closed } : d)); setIsDirty(true); }}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer ${!day.closed ? "bg-emerald-500" : "bg-red-400"}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${!day.closed ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
              <div className={`grid grid-cols-2 gap-3 transition-all duration-200 ${day.closed ? "opacity-50 pointer-events-none" : ""}`}>
                <div><p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Abertura</p><TimeSelect value={day.open} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, open: v } : d)); setIsDirty(true); }} disabled={day.closed} /></div>
                <div><p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Fechamento</p><TimeSelect value={day.close} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, close: v } : d)); setIsDirty(true); }} disabled={day.closed} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isDirty} className="bg-[#0c9894] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#087c7c] transition-colors disabled:opacity-50">
        {mutation.isPending ? "A guardar..." : "Guardar alterações"}
      </button>
    </div>
  );
}

function ProductsManager({ store }: { store: any }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products", store?.id],
    queryFn: async () => {
      const res = await fetch(`/api/products?store_id=${store.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!store?.id,
  });

  const createMut = useMutation({
    mutationFn: () => {
      if (editProduct) {
        return updateProduct(editProduct.id, { ...form, price: Number(form.price) || 0, imageUrl: productImages[0] || "", imageUrls: productImages });
      }
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const selectedCat = FORMACOES_CATEGORIES.find((g) => g.title === form.category);
      return createProduct({ id, ...form, category: selectedCat ? selectedCat.title : form.category, price: Number(form.price) || 0, storeId: store.id, imageUrl: productImages[0] || "", imageUrls: productImages });
    },
    onSuccess: () => { setShowForm(false); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); queryClient.invalidateQueries({ queryKey: ["products"] }); },
    onError: (error: Error) => { console.error("Erro ao guardar serviço:", error.message); alert("Erro ao guardar: " + error.message); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = 5 - productImages.length;
    if (remaining <= 0) { alert("Máximo de 5 imagens por serviço."); return; }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploadingImg(true);
    try {
      for (const file of toUpload) {
        const res = await new Promise<{ imageUrl: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const imgRes = await uploadImage(reader.result as string, `form-${Date.now()}-${Math.random().toString(36).slice(2)}`);
              resolve(imgRes);
            } catch (err) { reject(err); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setProductImages((prev) => [...prev, res.imageUrl]);
      }
    } catch (err: any) { alert(err.message); } finally { setUploadingImg(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#123c4a]">Serviços</h2>
        <button onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); }} className="flex items-center gap-2 bg-[#0c9894] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#087c7c] transition-colors">
          <Plus size={15} /> Novo serviço
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl border border-[#e8eced] p-6 space-y-4">
            <h3 className="font-bold text-[#123c4a]">{editProduct ? "Editar Serviço" : "Novo Serviço"}</h3>
            <div>
              <label className={labelCls}>Nome</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Preço</label>
                <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Moeda</label>
                <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className={inputCls}>
                  <option value="AOA">AOA</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Categoria</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
                <option value="">Selecione</option>
                {FORMACOES_CATEGORIES.map((c) => <option key={c.category} value={c.title}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Imagens do serviço (até 5)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productImages.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e8eced]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setProductImages((prev) => prev.filter((_, j) => j !== i))} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"><X size={10} /></button>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#0c9894] hover:text-[#0c9894] cursor-pointer transition-colors">
                <Camera size={14} /> {uploadingImg ? "A enviar..." : `Adicionar imagem (até 5)`}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImgUpload} disabled={uploadingImg} />
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-[#d1d4d8] py-2.5 rounded-full text-sm">Cancelar</button>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending || !form.name} className="flex-1 bg-[#0c9894] text-white py-2.5 rounded-full text-sm font-medium disabled:opacity-50">
                {createMut.isPending ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl border border-[#e8eced] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              <div>
                <p className="text-sm font-medium text-[#123c4a]">{p.name}</p>
                <p className="text-xs text-[#87909a]">{p.price} {p.currency}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditProduct(p); setForm({ name: p.name, price: String(p.price), currency: p.currency || "AOA", category: p.category || "", subcategory: p.subcategory || "", description: p.description || "" }); setProductImages(p.imageUrls || []); setShowForm(true); }} className="p-2 text-[#87909a] hover:text-[#0c9894] transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => { if (confirm("Eliminar este serviço?")) deleteMut.mutate(p.id); }} className="p-2 text-[#87909a] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactEditor({ store, isDirty, setIsDirty, saveFnRef }: { store: any; isDirty: boolean; setIsDirty: (v: boolean) => void; saveFnRef: React.MutableRefObject<(() => void) | null> }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ phone: store.phone || "", whatsapp: store.whatsapp || "" });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateStore(store.id, form),
    onSuccess: () => { setIsDirty(false); setSaved(true); setTimeout(() => setSaved(false), 2000); queryClient.invalidateQueries({ queryKey: ["myStore"] }); },
  });

  useEffect(() => { saveFnRef.current = () => mutation.mutate(); }, [mutation]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#123c4a]">Contactos</h2>
        {saved && <span className="text-xs text-green-600 font-medium">Guardado!</span>}
      </div>
      <div className="bg-white rounded-2xl border border-[#e8eced] p-6 space-y-5">
        <div>
          <label className={labelCls}>Telefone</label>
          <input type="tel" value={form.phone} onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setIsDirty(true); }} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>WhatsApp</label>
          <input type="tel" value={form.whatsapp} onChange={(e) => { setForm((f) => ({ ...f, whatsapp: e.target.value })); setIsDirty(true); }} className={inputCls} />
        </div>
        <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !isDirty} className="bg-[#0c9894] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#087c7c] transition-colors disabled:opacity-50">
          {mutation.isPending ? "A guardar..." : "Guardar alterações"}
        </button>
      </div>
    </div>
  );
}
