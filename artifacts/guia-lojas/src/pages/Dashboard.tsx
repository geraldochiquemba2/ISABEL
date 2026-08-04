import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStoreById, updateStore, createProduct, deleteProduct, updateProduct, cancelApplication, changePassword } from "@/lib/api";
import { AdminPanel } from "@/components/AdminPanel";
import { Ban, ShieldAlert, LogOut, Info, RefreshCw, Eye, MessageCircle, TrendingUp, Edit2, Trash2, Plus, ChevronRight, Tag, AlertTriangle, X, LayoutDashboard, Store, Package, Camera, KeyRound, EyeOff } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { CATEGORIES } from "@/data/mock";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";

type Section = "overview" | "loja" | "produtos" | "admin";

export default function Dashboard() {
  const [loc, setLoc] = useLocation();
  const queryClient = useQueryClient();

  // Obter utilizador local
  const localUserStr = localStorage.getItem("guialocal_user");
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;

  useEffect(() => {
    if (!localUser) {
      setLoc("/login");
    }
  }, [localUser, setLoc]);

  if (!localUser) return null;

  const isAdmin = localUser.phone === "999999999";

  const [section, setSection] = useState<Section>(isAdmin ? "admin" : "overview");
  const [isDirty, setIsDirty] = useState(false);
  const saveFnRef = useRef<(() => void) | null>(null);

  // Forced password change modal
  const [showChangePwd, setShowChangePwd] = useState(!!localUser?.mustChangePassword);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  async function handleForceChangePwd() {
    setPwdError("");
    if (newPwd.length < 6) { setPwdError("A senha deve ter pelo menos 6 caracteres."); return; }
    if (newPwd !== confirmPwd) { setPwdError("As senhas não coincidem."); return; }
    if (newPwd === "123456789") { setPwdError("Escolha uma senha diferente da padrão."); return; }
    setPwdLoading(true);
    try {
      await changePassword(localUser.id, newPwd);
      const updatedUser = { ...localUser, mustChangePassword: false };
      localStorage.setItem("guialocal_user", JSON.stringify(updatedUser));
      setShowChangePwd(false);
    } catch (e: any) {
      setPwdError(e.message || "Erro ao alterar a senha.");
    } finally {
      setPwdLoading(false);
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Tens a certeza que desejas sair sem salvar?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleNavClick = (newSection: Section) => {
    if (isDirty) {
      if (!window.confirm("Tens a certeza que desejas sair sem salvar?")) return;
    }
    setIsDirty(false);
    setSection(newSection);
  };

  // Buscar dados da loja e do status da conta dinamicamente via React Query
  const { data: store, isLoading, error } = useQuery({
    queryKey: ["myStore", localUser.storeId],
    queryFn: () => fetchStoreById(localUser.storeId),
    enabled: !!localUser.storeId && !isAdmin,
  });

  const [saved, setSaved] = useState(false);

  // Verificar se o status da conta foi alterado no servidor
  useEffect(() => {
    if (localUser && localUser.id && !isAdmin) {
      import("@/lib/api").then(({ fetchUserStatus }) => {
        fetchUserStatus(localUser.id)
          .then((updatedUser) => {
            if (
              updatedUser &&
              (updatedUser.status !== localUser.status ||
                updatedUser.statusReason !== localUser.statusReason)
            ) {
              const newUser = {
                ...localUser,
                status: updatedUser.status,
                statusReason: updatedUser.statusReason,
              };
              localStorage.setItem("guialocal_user", JSON.stringify(newUser));
              window.location.reload();
            }
          })
          .catch(console.error);
      });
    }
  }, [localUser?.id, isAdmin]);

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("guialocal_user");
    setLoc("/login");
  };

  const handleRefreshStatus = async () => {
    if (!localUser?.id) return;
    try {
      const { fetchUserStatus } = await import("@/lib/api");
      const updatedUser = await fetchUserStatus(localUser.id);
      const newUser = {
        ...localUser,
        status: updatedUser.status,
        statusReason: updatedUser.statusReason,
      };
      localStorage.setItem("guialocal_user", JSON.stringify(newUser));
      window.location.reload();
    } catch (e) {
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const handleCancelMyRequest = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua solicitação de conta pendente?")) return;
    try {
      await cancelApplication(localUser.id);
      handleLogout();
    } catch (e) {
      alert("Erro ao cancelar solicitação.");
    }
  };

  // Se o utilizador normal está PENDENTE
  if (!isAdmin && localUser.status === "PENDENTE") {
    return (
      <PageTransition>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500">
            <ShieldAlert size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Pedido de Conta Pendente</h1>
            <p className="text-sm text-muted-foreground">
              Sua conta e loja estão em análise pela nossa equipe de administração.
            </p>
          </div>
          <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-4 text-xs text-amber-800 text-left space-y-2.5">
            <p className="font-semibold flex items-center gap-1.5"><Info size={14} /> O que acontece agora?</p>
            <p>Assim que o administrador aprovar sua solicitação, você poderá acessar o painel de controle e gerenciar seus produtos.</p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleRefreshStatus}
              className="w-full bg-foreground text-background py-2.5 rounded-full text-xs font-semibold hover:opacity-85 transition-opacity flex items-center justify-center gap-1.5 border border-black"
            >
              <RefreshCw size={13} /> Atualizar Status
            </button>
            <button
              onClick={handleCancelMyRequest}
              className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Ban size={13} /> Cancelar Pedido de Conta
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <LogOut size={13} /> Sair da conta
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Se o utilizador normal está RECUSADO
  if (!isAdmin && localUser.status === "RECUSADO") {
    return (
      <PageTransition>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-500">
            <Ban size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Solicitação Recusada</h1>
            <p className="text-sm text-muted-foreground">
              Lamentamos, mas o seu pedido de conta não foi aceite no momento.
            </p>
          </div>
          {localUser.statusReason && (
            <div className="bg-red-50/50 rounded-2xl border border-red-100 p-4 text-xs text-red-800 text-left space-y-1.5">
              <p className="font-semibold">Motivo apresentado pelo administrador:</p>
              <p className="italic bg-white p-2.5 rounded-xl border border-red-100/50 text-red-900 font-medium">"{localUser.statusReason}"</p>
            </div>
          )}
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Você pode entrar em contato com o suporte para esclarecer dúvidas ou cancelar este pedido para tentar criar outra conta.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá, meu pedido de loja na Eliora Collection foi recusado e gostaria de reavaliar.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#22c35f] text-white py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-black/10 shadow-sm"
              >
                Entrar em Contato via WhatsApp
              </a>
              <button
                onClick={handleCancelMyRequest}
                className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Ban size={13} /> Cancelar Solicitação
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <LogOut size={13} /> Sair da conta
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Se o utilizador normal está SUSPENSO
  if (!isAdmin && localUser.status === "SUSPENSO") {
    return (
      <PageTransition>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-500">
            <Ban size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Conta Suspensa</h1>
            <p className="text-sm text-muted-foreground">
              A sua conta foi temporariamente suspensa por um administrador.
            </p>
          </div>
          {localUser.statusReason && (
            <div className="bg-red-50/50 rounded-2xl border border-red-100 p-4 text-xs text-red-800 text-left space-y-1.5">
              <p className="font-semibold">Motivo apresentado pelo administrador:</p>
              <p className="italic bg-white p-2.5 rounded-xl border border-red-100/50 text-red-900 font-medium">"{localUser.statusReason}"</p>
            </div>
          )}
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Se considera que isto foi um erro, por favor entre em contacto com o suporte para reavaliar a situação.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá, a minha conta na Eliora Collection foi suspensa e gostaria de esclarecimentos.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#22c35f] text-white py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-black/10 shadow-sm"
              >
                Entrar em Contato via WhatsApp
              </a>
              <button
                onClick={handleRefreshStatus}
                className="w-full bg-foreground text-background py-2.5 rounded-full text-xs font-semibold hover:opacity-85 transition-opacity flex items-center justify-center gap-1.5 border border-black"
              >
                <RefreshCw size={13} /> Atualizar Status
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <LogOut size={13} /> Sair da conta
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }


  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = isAdmin
    ? [{ id: "admin", label: "Administração", icon: <ShieldAlert size={15} /> }]
    : [
        { id: "overview", label: "Visão Geral", icon: <LayoutDashboard size={15} /> },
        { id: "loja", label: "Minha Loja", icon: <Store size={15} /> },
        { id: "produtos", label: "Produtos", icon: <Package size={15} /> },
      ];

  return (
    <PageTransition>
      {/* ── Modal Obrigatório: Alterar Senha Padrão ── */}
      {showChangePwd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-black shadow-2xl p-7 w-full max-w-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Defina uma nova senha</h2>
                <p className="text-xs text-muted-foreground">A sua senha foi redefinida pelo administrador. Por segurança, escolha uma nova senha para continuar.</p>
              </div>
            </div>

            {pwdError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-medium">{pwdError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors pr-8"
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-0 top-2.5 text-muted-foreground">
                    {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Confirmar Nova Senha</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors pr-8"
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-0 top-2.5 text-muted-foreground">
                    {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleForceChangePwd}
              disabled={pwdLoading || !newPwd || !confirmPwd}
              className="w-full bg-foreground text-background py-3 text-sm font-semibold rounded-full hover:opacity-80 transition-opacity disabled:opacity-40 border border-black flex items-center justify-center gap-2"
            >
              <KeyRound size={14} />
              {pwdLoading ? "A guardar..." : "Definir Nova Senha"}
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
        {/* Sticky top bar com botão Salvar quando em "Minha Loja" */}
        {section === "loja" && (
          <div className="sticky top-14 z-30 bg-white border-b border-border px-4 sm:px-6 h-12 flex items-center justify-between shadow-sm">
            <span className="text-sm font-medium text-foreground">Minha Loja</span>
            <button
              onClick={() => saveFnRef.current?.()}
              disabled={!isDirty}
              className="bg-foreground text-background text-xs font-semibold px-5 py-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              Salvar alterações
            </button>
          </div>
        )}

        <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 bg-muted border-r border-border p-5 flex-shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-2 truncate">
            {isAdmin ? "Admin" : store?.name || "Painel"}
          </p>
          <nav className="space-y-0.5 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                  section === item.id
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-border"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left text-red-500 hover:bg-red-50 mt-auto"
          >
            <LogOut size={15} /> Sair
          </button>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                section === item.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-red-500"
          >
            <LogOut size={15} /> Sair
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 pb-20 md:pb-8 overflow-auto bg-white">
          {isLoading && !isAdmin ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Carregando dados da loja...</div>
          ) : (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {section === "overview" && <OverviewSection store={store} />}
              {section === "loja" && <LojaSection myStore={store} isDirty={isDirty} setDirty={setIsDirty} saveFnRef={saveFnRef} />}
              {section === "produtos" && <ProdutosSection myStore={store} />}
              {section === "admin" && <AdminPanel />}
            </motion.div>
          )}
        </main>
        </div>
      </div>
    </PageTransition>
  );
}



function CleanField({ label, defaultValue, testId, as: As = "input" }: {
  label: string; defaultValue: string; testId: string; as?: "input" | "textarea";
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">{label}</label>
      {As === "textarea" ? (
        <textarea data-testid={testId} defaultValue={defaultValue} rows={3}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors resize-none" />
      ) : (
        <input data-testid={testId} defaultValue={defaultValue}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors" />
      )}
    </div>
  );
}

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
  { label: "Sábado",          closed: false, open: "09:00", close: "14:00" },
  { label: "Domingo",         closed: true,  open: "08:00", close: "18:00" },
];

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(event.target?.result as string);
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7)); // Comprime para JPEG 70% qualidade
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

function TimeSelect({
  value, onChange, disabled, testId,
}: { value: string; onChange: (v: string) => void; disabled?: boolean; testId?: string }) {
  return (
    <div className="relative">
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none border border-border rounded-xl px-3 py-2 text-xs text-foreground bg-white outline-none focus:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed pr-7 cursor-pointer"
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
        <ChevronRight size={12} className="rotate-90" />
      </span>
    </div>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-black rounded-2xl p-5 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      {sub && <p className="text-[10px] font-medium text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function OverviewSection({ store }: { store: any }) {
  const productsCount = store?.products?.length || 0;
  const views = store?.views || 0;
  const contacts = store?.whatsapp_contacts || 0;
  const clicks = store?.whatsapp_clicks || 0;

  return (
    <div className="space-y-7 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Visão Geral — {store?.name || "Minha Loja"}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Últimos 30 dias</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={<Eye size={14} />} label="Visualizações" value={views} sub="este mês" />
        <Stat icon={<MessageCircle size={14} />} label="Contatos WhatsApp" value={contacts} sub="este mês" />
        <Stat icon={<Package size={14} />} label="Produtos" value={productsCount} />
        <Stat icon={<TrendingUp size={14} />} label="Cliques no WhatsApp" value={clicks} sub="este mês" />
      </div>
    </div>
  );
}

function LojaSection({ myStore, isDirty, setDirty, saveFnRef }: { myStore: any, isDirty: boolean, setDirty: (d: boolean) => void, saveFnRef?: React.MutableRefObject<any> }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [province, setProvince] = useState(myStore?.province || "Luanda");
  const [municipality, setMunicipality] = useState(myStore?.municipality || "Luanda");
  const [category, setCategory] = useState(myStore?.category || "Moda");
  
  // Novos estados para Inputs
  const [name, setName] = useState(myStore?.name || "");
  const [description, setDescription] = useState(myStore?.description || "");
  const [phone, setPhone] = useState(myStore?.phone || "");
  const [address, setAddress] = useState(myStore?.address || "");
  const [logoUrl, setLogoUrl] = useState(myStore?.logoUrl || "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // Novo estado para Foto de Capa
  const [coverImages, setCoverImages] = useState<string[]>(myStore?.coverImages || (myStore?.coverImage ? [myStore.coverImage] : []));
  const [uploadingCover, setUploadingCover] = useState(false);

  // Guard: aguarda que os dados da loja estejam disponíveis
  if (!myStore) {
    return <div className="text-center py-12 text-sm text-muted-foreground">A carregar dados da loja...</div>;
  }

  const selectedProvinceObj = ANGOLA_PROVINCES.find((p) => p.name === province);
  const municipalities = selectedProvinceObj ? selectedProvinceObj.municipalities : [];

  function updateDay(i: number, patch: Partial<DaySchedule>) {
    setSchedule((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
    setSaved(false);
    setDirty(true);
  }

  // Helper para carregar logo de perfil via Telegram Bot
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError("");
    try {
      const base64String = await compressImage(file);
      const { uploadImage } = await import("@/lib/api");
      const res = await uploadImage(base64String, `logo_${Date.now()}_${file.name}`);
      setLogoUrl(res.imageUrl);
      setSaved(false);
      setDirty(true);
      setUploadingLogo(false);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar a foto de perfil. Verifica se o teu bot está ligado.");
      setUploadingLogo(false);
    }
  };

  // Helper para carregar foto de capa via Telegram Bot
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCover(true);
    setError("");
    try {
      const { uploadImage } = await import("@/lib/api");
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await compressImage(file);
        const res = await uploadImage(base64String, `cover_${Date.now()}_${file.name}`);
        newImageUrls.push(res.imageUrl);
      }
      setCoverImages((prev) => {
        const newImages = [...prev, ...newImageUrls];
        return newImages.slice(0, 10);
      });
      setSaved(false);
      setDirty(true);
      setUploadingCover(false);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar a(s) foto(s) de capa.");
      setUploadingCover(false);
    }
  };

  async function handleSave() {
    setLoading(true);
    setError("");
    try {
      const { updateStore } = await import("@/lib/api");
      await updateStore(myStore.id, {
        ...myStore,
        name,
        category,
        description,
        phone,
        address,
        province,
        municipality,
        logoUrl,
        coverImage: coverImages[0] || "",
        coverImages,
      });
      
      // Atualizar objeto local
      myStore.name = name;
      myStore.category = category;
      Object.assign(myStore, {
        name, category, description, phone, address, province, municipality, logoUrl, coverImage: coverImages[0] || "", coverImages, schedule,
      });

      setSaved(true);
      setDirty(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao guardar alterações");
    } finally {
      setLoading(false);
    }
  }

  if (saveFnRef) {
    saveFnRef.current = handleSave;
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-xl font-semibold text-foreground tracking-tight font-sans">Minha Loja</h1>
      
      {/* Secção de Foto de Perfil (Logo) */}
      <div className="border border-black rounded-2xl p-5 bg-white space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Foto de Perfil (Logotipo)</label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo da Loja"
              className="w-16 h-16 rounded-2xl object-cover bg-muted border border-black/10 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-muted border border-dashed border-black/25 flex items-center justify-center text-xs text-muted-foreground font-medium">
              Sem Foto
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              id="logo-upload"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={uploadingLogo}
            />
            <label
              htmlFor="logo-upload"
              className={`inline-flex items-center justify-center px-4 py-2 border border-black rounded-full text-xs font-semibold cursor-pointer hover:bg-muted transition-colors ${
                uploadingLogo ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {uploadingLogo ? "A carregar foto via Telegram..." : "Alterar Foto de Perfil"}
            </label>
            <p className="text-[10px] text-muted-foreground">Adiciona uma imagem quadrada para o teu perfil.</p>
          </div>
        </div>
      </div>

      {/* Secção de Foto de Capa (Cover) - Multiplas fotos */}
      <div className="border border-black rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Fotos de Capa ({coverImages.length}/10)</label>
        </div>
        <div className="flex flex-col gap-4">
          {coverImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {coverImages.map((img, idx) => (
                <div key={idx} className="w-full h-24 rounded-xl bg-muted border border-black/10 shadow-sm relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70"
                    style={{ backgroundImage: `url(${img})` }} 
                  />
                  <img
                    src={img}
                    alt={`Capa ${idx + 1}`}
                    className="w-full h-full object-contain relative z-10"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverImages((prev) => prev.filter((_, i) => i !== idx));
                      setSaved(false);
                      setDirty(true);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-sm"
                  >
                    <X size={12} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm z-20">Principal</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-32 rounded-xl bg-muted border border-dashed border-black/25 flex items-center justify-center text-xs text-muted-foreground font-medium">
              Sem Fotos de Capa
            </div>
          )}
          
          {coverImages.length < 10 && (
            <div className="flex-1 space-y-2 mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                id="cover-upload"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={uploadingCover}
              />
              <label
                htmlFor="cover-upload"
                className={`inline-flex items-center justify-center px-4 py-2 border border-black rounded-full text-xs font-semibold cursor-pointer hover:bg-muted transition-colors ${
                  uploadingCover ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploadingCover ? "A carregar foto..." : "Adicionar Foto de Capa"}
              </label>
              <p className="text-[10px] text-muted-foreground">Podes adicionar até 10 imagens. A primeira será a imagem principal.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Nome da loja</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false); setDirty(true); }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); setSaved(false); setDirty(true); }}
          rows={3}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Telefone</label>
        <input
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setSaved(false); setDirty(true); }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors"
        />
      </div>
      
      {/* Categoria Dropdown */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Categoria da Loja</label>
        <select
          data-testid="select-store-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSaved(false);
            setDirty(true);
          }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors cursor-pointer"
        >
          <option value="" className="text-muted-foreground">Selecione a categoria</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name} className="text-foreground bg-white">{cat.name}</option>
          ))}
        </select>
      </div>
      
      {/* Província Dropdown */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Província (Angola)</label>
        <select
          data-testid="select-store-province"
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            setMunicipality("");
            setSaved(false);
            setDirty(true);
          }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors cursor-pointer"
        >
          <option value="" className="text-muted-foreground">Selecione a província</option>
          {ANGOLA_PROVINCES.map((p) => (
            <option key={p.id} value={p.name} className="text-foreground bg-white">{p.name}</option>
          ))}
        </select>
      </div>

      {/* Município Dropdown */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Município</label>
        <select
          data-testid="select-store-municipality"
          value={municipality}
          disabled={!province}
          onChange={(e) => {
            setMunicipality(e.target.value);
            setSaved(false);
            setDirty(true);
          }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors cursor-pointer disabled:opacity-50"
        >
          <option value="" className="text-muted-foreground">
            {province ? "Selecione o Município" : "Selecione a província primeiro"}
          </option>
          {municipalities.map((m) => (
            <option key={m} value={m} className="text-foreground bg-white">{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Endereço detalhado</label>
        <input
          value={address}
          onChange={(e) => { setAddress(e.target.value); setSaved(false); setDirty(true); }}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-4">
          Horários de funcionamento
        </label>
        <div className="space-y-3">
          {schedule.map((day, i) => (
            <div key={day.label} className="border border-black rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{day.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                    day.closed 
                      ? "bg-red-50 text-red-600 border border-red-100" 
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}>
                    {day.closed ? "Fechado" : "Aberto"}
                  </span>
                </div>
                {/* Fechado toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid={`toggle-closed-${i}`}
                    onClick={() => updateDay(i, { closed: !day.closed })}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer focus:outline-none ${
                      !day.closed ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                        !day.closed ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-3 transition-all duration-200 ${day.closed ? "opacity-50 pointer-events-none" : ""}`}>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Abertura</p>
                  <TimeSelect
                    testId={`select-open-${i}`}
                    value={day.open}
                    onChange={(v) => updateDay(i, { open: v })}
                    disabled={day.closed}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Fechamento</p>
                  <TimeSelect
                    testId={`select-close-${i}`}
                    value={day.close}
                    onChange={(v) => updateDay(i, { close: v })}
                    disabled={day.closed}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          data-testid="button-save-store"
          onClick={handleSave}
          disabled={loading || (!isDirty && saved)}
          className="bg-foreground text-background text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {loading ? "A salvar alterações..." : "Salvar alterações"}
        </button>
        {saved && !isDirty && <span className="text-sm text-emerald-600 font-medium">Salvo com sucesso!</span>}
      </div>
    </div>
  );
}

function ProdutosSection({ myStore }: { myStore: any }) {
  const { data: products = [], refetch } = useQuery<Product[]>({
    queryKey: ["products", myStore?.id],
    queryFn: async () => {
      const res = await fetch(`/api/products?store_id=${myStore?.id}`);
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      return res.json();
    },
    enabled: !!myStore?.id,
  });

  const [adding, setAdding] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCurrency, setNewCurrency] = useState("AOA");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newSubcategoryId, setNewSubcategoryId] = useState("");
  
  // Imagem do Produto
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [newUploading, setNewUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = PRODUCT_CATEGORIES.find((c) => c.id === newCategoryId);

  function resetForm() {
    setNewName("");
    setNewPrice("");
    setNewCurrency("AOA");
    setNewCategoryId("");
    setNewSubcategoryId("");
    setNewImageUrls([]);
    setError("");
    setAdding(false);
  }

  // Upload da imagem do produto via Telegram Bot
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setNewUploading(true);
    setError("");
    try {
      const { uploadImage } = await import("@/lib/api");
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await compressImage(file);
        const res = await uploadImage(base64String, `prod_${Date.now()}_${file.name}`);
        urls.push(res.imageUrl);
      }
      setNewImageUrls((prev) => [...prev, ...urls].slice(0, 10));
      setNewUploading(false);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar imagem(s) do produto.");
      setNewUploading(false);
    }
  };

  async function addProduct() {
    if (!newName.trim()) return;
    setError("");
    try {
      const cat = PRODUCT_CATEGORIES.find((c) => c.id === newCategoryId);
      const sub = cat?.subcategories.find((s) => s.id === newSubcategoryId);

      const { createProduct } = await import("@/lib/api");
      await createProduct({
        id: `p-${Date.now()}`,
        storeId: myStore.id,
        name: newName,
        price: parseFloat(newPrice) || 0,
        currency: newCurrency,
        imageUrl: newImageUrls[0] || undefined,
        imageUrls: newImageUrls,
        imageColor: "#f0f0f0",
        category: cat?.name || undefined,
        subcategory: sub?.name || undefined,
      });

      await refetch();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao adicionar o produto.");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} itens cadastrados</p>
        </div>
        {!adding && (
          <button
            data-testid="button-add-product"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-foreground rounded-full px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <Plus size={13} /> Adicionar
          </button>
        )}
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-black rounded-2xl p-6 space-y-5 bg-muted/30"
          >
            <p className="text-sm font-semibold text-foreground">Novo produto / serviço</p>

            {/* Name + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Nome
                </label>
                <input
                  data-testid="input-new-product-name"
                  placeholder="Ex: Vestido Floral"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Preço
                </label>
                <div className="flex items-center border-b border-border focus-within:border-foreground">
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="bg-transparent text-sm outline-none text-muted-foreground font-medium appearance-none py-2 pr-2"
                  >
                    <option value="AOA">Kz</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>
                  <input
                    data-testid="input-new-product-price"
                    placeholder="0,00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-transparent py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
            {/* Imagem do Produto */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Fotos do Produto</label>

              {/* Grelha de thumbs + botão adicionar */}
              <div className="flex flex-wrap gap-2 items-center">
                {newImageUrls.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors z-10"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* Botão para adicionar mais fotos */}
                {newImageUrls.length < 10 && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="product-image-upload"
                      onChange={handleProductImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={newUploading}
                    />
                    <div className={`w-16 h-16 rounded-xl border-2 border-dashed border-foreground/30 flex flex-col items-center justify-center gap-1 hover:bg-muted transition-colors cursor-pointer ${newUploading ? "opacity-50 pointer-events-none" : ""}`}>
                      {newUploading
                        ? <span className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                        : <><Camera size={16} className="text-muted-foreground" /><span className="text-[9px] text-muted-foreground font-medium">Adicionar</span></>
                      }
                    </div>
                  </div>
                )}
              </div>
              {newImageUrls.length > 0 && (
                <p className="text-[10px] text-muted-foreground">{newImageUrls.length} foto{newImageUrls.length > 1 ? "s" : ""} selecionada{newImageUrls.length > 1 ? "s" : ""}. Podes adicionar até 10.</p>
              )}
            </div>


            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            {/* Category */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    data-testid={`button-cat-${cat.id}`}
                    type="button"
                    onClick={() => {
                      setNewCategoryId(cat.id === newCategoryId ? "" : cat.id);
                      setNewSubcategoryId("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      newCategoryId === cat.id
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory — appears after category is selected */}
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2 flex items-center gap-1.5">
                      <ChevronRight size={11} />
                      Subcategoria em <span className="text-foreground">{selectedCategory.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          data-testid={`button-subcat-${sub.id}`}
                          type="button"
                          onClick={() => setNewSubcategoryId(sub.id === newSubcategoryId ? "" : sub.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            newSubcategoryId === sub.id
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary preview */}
            {(newCategoryId || newSubcategoryId) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-muted px-3 py-2 rounded-xl"
              >
                <Tag size={13} className="text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Classificado como:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedCategory?.name}
                    {newSubcategoryId && ` › ${selectedCategory?.subcategories.find((s) => s.id === newSubcategoryId)?.name}`}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                data-testid="button-confirm-add"
                onClick={addProduct}
                disabled={!newName.trim() || !newCategoryId}
                className="text-sm font-medium text-background bg-foreground px-5 py-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Adicionar produto
              </button>
              <button
                onClick={resetForm}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product list */}
      <div className="space-y-6">
        {Object.entries(
          products.reduce<Record<string, Product[]>>((acc, p) => {
            const cat = p.category || "Outros / Sem Categoria";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
          }, {})
        ).map(([categoryName, items]) => (
          <div key={categoryName} className="border border-black rounded-2xl p-4 bg-muted/5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2 mb-1.5">
              <span className="w-1.5 h-3.5 bg-foreground rounded-full" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground/90">
                {categoryName}
              </h2>
              <span className="text-[10px] text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-full">
                {items.length} {items.length === 1 ? "item" : "itens"}
              </span>
            </div>
            <div className="divide-y divide-black">
              {items.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  onDelete={(id) => refetch()}
                  onUpdate={() => refetch()}
                />
              ))}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ productName, onConfirm, onCancel }: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Eliminar produto?</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Tem a certeza que deseja eliminar <span className="font-medium text-foreground">"{productName}"</span>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-full transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              Sim, eliminar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProductRow({ product, onDelete, onUpdate }: { product: Product; onDelete: (id: string) => void; onUpdate: (p: Product) => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(product.price.toString());
  const [editCurrency, setEditCurrency] = useState(product.currency || "AOA");
  const [editImageUrls, setEditImageUrls] = useState<string[]>(
    (product as any).imageUrls?.length ? (product as any).imageUrls : (product.imageUrl ? [product.imageUrl] : [])
  );
  const [editCategoryId, setEditCategoryId] = useState(() => {
    const cat = PRODUCT_CATEGORIES.find(c => c.name === product.category);
    return cat?.id || "";
  });
  const [editSubcategoryId, setEditSubcategoryId] = useState(() => {
    const cat = PRODUCT_CATEGORIES.find(c => c.name === product.category);
    const sub = cat?.subcategories.find(s => s.name === product.subcategory);
    return sub?.id || "";
  });

  const editSelectedCategory = PRODUCT_CATEGORIES.find(c => c.id === editCategoryId);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { uploadImage } = await import("@/lib/api");
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await compressImage(file);
        const res = await uploadImage(base64String, `prod_${Date.now()}_${file.name}`);
        urls.push(res.imageUrl);
      }
      setEditImageUrls(prev => [...prev, ...urls].slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const { updateProduct } = await import("@/lib/api");
      const cat = PRODUCT_CATEGORIES.find(c => c.id === editCategoryId);
      const sub = cat?.subcategories.find(s => s.id === editSubcategoryId);
      const updated = {
        ...product,
        name: editName,
        price: parseFloat(editPrice) || 0,
        currency: editCurrency,
        imageUrl: editImageUrls[0] || undefined,
        imageUrls: editImageUrls,
        category: cat?.name || product.category,
        subcategory: sub?.name || undefined,
      };
      await updateProduct(product.id, updated);
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { deleteProduct } = await import("@/lib/api");
      await deleteProduct(product.id);
      onDelete(product.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          productName={product.name}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {editing ? (
        <div className="py-4 space-y-4 bg-muted/20 rounded-xl px-3 -mx-1" data-testid={`row-product-edit-${product.id}`}>

          {/* Nome + Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">Nome do Produto *</label>
              <input
                data-testid={`input-edit-product-name-${product.id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-black rounded-xl px-3 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-black text-foreground"
              />
            </div>
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">Preço</label>
              <div className="flex items-center border border-black rounded-xl overflow-hidden bg-white">
                <select
                  value={editCurrency}
                  onChange={(e) => setEditCurrency(e.target.value)}
                  className="bg-transparent text-sm outline-none text-muted-foreground appearance-none pl-2 pr-1"
                >
                  <option value="AOA">Kz</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
                <input
                  data-testid={`input-edit-product-price-${product.id}`}
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  type="number" min="0" step="0.01"
                  className="w-full py-1.5 pr-3 text-sm outline-none text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Fotos</label>
            <div className="flex flex-wrap gap-2 items-center">
              {editImageUrls.map((url, i) => (
                <div key={i} className="relative w-14 h-14 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setEditImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 z-10">
                    <X size={9} />
                  </button>
                </div>
              ))}
              {editImageUrls.length < 10 && (
                <div className="relative w-14 h-14">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} />
                  <div className={`w-14 h-14 rounded-xl border-2 border-dashed border-foreground/30 flex flex-col items-center justify-center gap-0.5 hover:bg-muted transition-colors ${uploading ? "opacity-50" : ""}`}>
                    {uploading ? <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : <><Camera size={14} className="text-muted-foreground" /><span className="text-[8px] text-muted-foreground">Adicionar</span></>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Categoria *</label>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCT_CATEGORIES.map(cat => (
                <button key={cat.id} type="button"
                  onClick={() => { setEditCategoryId(cat.id === editCategoryId ? "" : cat.id); setEditSubcategoryId(""); }}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${editCategoryId === cat.id ? "bg-foreground text-background border-black" : "border-border text-muted-foreground hover:border-black hover:text-foreground"}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategoria */}
          {editSelectedCategory && editSelectedCategory.subcategories.length > 0 && (
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">Subcategoria</label>
              <div className="flex flex-wrap gap-1.5">
                {editSelectedCategory.subcategories.map(sub => (
                  <button key={sub.id} type="button"
                    onClick={() => setEditSubcategoryId(sub.id === editSubcategoryId ? "" : sub.id)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${editSubcategoryId === sub.id ? "bg-foreground text-background border-black" : "border-border text-muted-foreground hover:border-black hover:text-foreground"}`}>
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2 text-xs pt-1">
            <button onClick={() => { setEditing(false); setEditName(product.name); setEditPrice(product.price.toString()); setEditCurrency(product.currency || "AOA"); }}
              className="px-3 py-1.5 border border-black rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={!editName.trim() || saving}
              className="px-3 py-1.5 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 border border-black flex items-center gap-1.5">
              {saving ? <span className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" /> : null}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 py-3.5" data-testid={`row-product-${product.id}`}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: product.imageColor }} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{product.name}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-muted-foreground">
                {product.price > 0 ? `${product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : 'Kz'} ${product.price.toFixed(2).replace(".", ",")}` : "Gratuito"}
              </p>
              {product.category && (
                <>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                    <Tag size={9} />
                    {product.category}
                  </span>
                </>
              )}
              {product.subcategory && (
                <>
                  <ChevronRight size={10} className="text-muted-foreground" />
                  <span className="inline-flex items-center text-[11px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                    {product.subcategory}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              data-testid={`button-edit-product-${product.id}`}
              onClick={() => setEditing(!editing)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit2 size={13} />
            </button>
            <button
              data-testid={`button-delete-product-${product.id}`}
              onClick={() => setConfirmDelete(true)}
              disabled={deleting}
              className="p-1.5 text-red-500 hover:text-red-600 transition-colors disabled:opacity-40"
            >
              {deleting ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block" /> : <Trash2 size={13} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

