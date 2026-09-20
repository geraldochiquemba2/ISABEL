import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loginLojista, registerLojista } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import MapPicker from "@/components/MapPicker";

const SERVICOS_CATEGORIES = [
  "Documentação & Tramitação",
  "Consultoria Especializada",
  "Secretariado & Assistência Profissional",
  "Arquitectura & Engenharia",
  "Tradução & Interpretação",
  "Design & Serviços Criativos",
  "Cerimonial & Protocolo",
];

const loginSchema = z.object({
  phone: z.string().regex(/^\d{9}$/, "Número deve ter exatamente 9 dígitos"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  storeName: z.string().min(2, "Nome muito curto").regex(/[a-zA-ZáàâãéèêíïóôõúüçÁÀÂÃÉÈÊÍÏÓÔÕÚÜÇ]/, "O nome deve conter pelo menos uma letra"),
  phone: z.string().regex(/^\d{9}$/, "Número deve ter exatamente 9 dígitos"),
  category: z.string().min(1, "Selecione a categoria"),
  province: z.string().min(1, "Selecione a província"),
  municipality: z.string().min(1, "Selecione o município"),
  address: z.string().min(2, "Endereço muito curto"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const accentColor = "#1A237E";
const bgLight = "#E8EAF6";
const textDark = "#0D1B6B";

const inputCls =
  "w-full border border-[#c8cce4] bg-white py-3 px-4 text-sm text-[#1a1a2a] placeholder:text-[#6B7280] outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/10 transition-all rounded-xl";
const labelCls = "block text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function LoginServicosProf() {
  useThemeColor("#E8EAF6");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [, setLoc] = useWouterLocation();

  const {
    register: loginReg,
    handleSubmit: loginSubmit,
    formState: { errors: loginErr },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const {
    register: regReg,
    handleSubmit: regSubmit,
    watch,
    setValue,
    formState: { errors: regErr },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const selectedProvinceName = watch("province");
  const selectedProvince = ANGOLA_PROVINCES.find((p) => p.name === selectedProvinceName);
  const municipalities = selectedProvince ? selectedProvince.municipalities : [];

  const onLoginSubmit = async (values: LoginValues) => {
    setError("");
    try {
      const res = await loginLojista({ ...values, storeType: "servicos-profissionais" });
      const user = res.user;
      localStorage.setItem("guialocal_user", JSON.stringify({ ...user, storeType: "servicos-profissionais" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-servicos"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const res = await registerLojista({ ...values, storeType: "servicos-profissionais", latitude: latitude || undefined, longitude: longitude || undefined });
      localStorage.setItem("guialocal_user", JSON.stringify({ ...res.user, storeType: "servicos-profissionais" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-servicos"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  return (
    <main className="min-h-[100dvh] text-[#1a1a2a]" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: bgLight }}>
      <div className="mx-auto max-w-[1380px] px-6 py-8 md:px-12">
        <button
          onClick={() => window.location.href = "/servicos"}
          className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#1A237E] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo-yesola-icon-dark.png" alt="YESOLA" className="w-10 h-10" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: accentColor }}>YESOLA<small style={{ display: "block", color: textDark, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Serviços</small></span>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#c8cce4]">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m
                    ? "border-[#1A237E] text-[#1A237E]"
                    : "border-transparent text-[#6B7280] hover:text-[#1A237E]"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs mb-6 font-medium">
              {error}
            </div>
          )}

          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>
                {mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
              </p>
              <p className="text-xs text-[#6B7280] mb-6">Redirecionando para o painel...</p>
            </motion.div>
          ) : mode === "login" ? (
            <form onSubmit={loginSubmit(onLoginSubmit)} className="space-y-6">
              <div>
                <label className={labelCls}>Número de Telefone</label>
                <input type="tel" placeholder="Ex: 922001778" className={inputCls} {...loginReg("phone")} />
                <FieldError msg={loginErr.phone?.message} />
              </div>

              <div>
                <label className={labelCls}>Senha</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...loginReg("password")} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#6B7280]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={loginErr.password?.message} />
              </div>

              <button type="button" onClick={() => setShowForgotPwd(true)} className="text-xs text-[#87909a] hover:underline mt-2 mb-2">
                Esqueci a senha?
              </button>

              <button type="submit" className="w-full text-white py-3 text-sm font-medium rounded-full transition-colors" style={{ backgroundColor: accentColor }}>
                Entrar
              </button>

              <div className="text-center pt-2">
                <a href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá! Gostaria de redefinir a minha palavra-passe na YESOLA Serviços Profissionais.")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6B7280] hover:text-[#1A237E] underline underline-offset-2 transition-colors">
                  Esqueci a minha palavra-passe
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Nome da Loja</label>
                <input type="text" placeholder="Nome de sua loja" className={inputCls} {...regReg("storeName")} />
                <FieldError msg={regErr.storeName?.message} />
              </div>

              <div>
                <label className={labelCls}>Número de Telefone</label>
                <input type="tel" placeholder="Ex: 999999999" className={inputCls} {...regReg("phone")} />
                <FieldError msg={regErr.phone?.message} />
              </div>

              <div>
                <label className={labelCls}>Categoria da Loja</label>
                <select className={`${inputCls} cursor-pointer`} {...regReg("category")}>
                  <option value="">Selecione a categoria</option>
                  {SERVICOS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-[#1a1a2a]">
                      {cat}
                    </option>
                  ))}
                </select>
                <FieldError msg={regErr.category?.message} />
              </div>

              <div>
                <label className={labelCls}>Província (Angola)</label>
                <select
                  className={`${inputCls} cursor-pointer`}
                  {...regReg("province", { onChange: () => setValue("municipality", "") })}
                >
                  <option value="">Selecione a Província</option>
                  {ANGOLA_PROVINCES.map((p) => (
                    <option key={p.name} value={p.name} className="bg-white text-[#1a1a2a]">{p.name}</option>
                  ))}
                </select>
                <FieldError msg={regErr.province?.message} />
              </div>

              <div>
                <label className={labelCls}>Município</label>
                <select
                  className={`${inputCls} cursor-pointer disabled:opacity-50`}
                  disabled={!selectedProvinceName}
                  {...regReg("municipality")}
                >
                  <option value="">{selectedProvinceName ? "Selecione o Município" : "Selecione a província primeiro"}</option>
                  {municipalities.map((m) => (
                    <option key={m} value={m} className="bg-white text-[#1a1a2a]">{m}</option>
                  ))}
                </select>
                <FieldError msg={regErr.municipality?.message} />
              </div>

              <div>
                <label className={labelCls}>Endereço detalhado</label>
                <input type="text" placeholder="Rua, Bairro, Casa nº" className={inputCls} {...regReg("address")} />
                <FieldError msg={regErr.address?.message} />
              </div>

              {/* Mapa de Localização */}
              <div>
                <label className={labelCls}>Localização no Mapa (Opcional)</label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-colors ${
                    latitude && longitude 
                      ? "border-[#1565C0] bg-blue-50" 
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    latitude && longitude ? "bg-[#1565C0]" : "bg-gray-200"
                  }`}>
                    <MapPin size={16} className={latitude && longitude ? "text-white" : "text-gray-500"} />
                  </div>
                  <div className="text-left flex-1">
                    {latitude && longitude ? (
                      <>
                        <p className="text-sm font-medium text-gray-900">Localização definida</p>
                        <p className="text-xs text-gray-500 font-mono">{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">Marcar localização no mapa</p>
                        <p className="text-xs text-gray-400">Toque para abrir o mapa e marcar o ponto exacto</p>
                      </>
                    )}
                  </div>
                  <Navigation size={16} className={latitude && longitude ? "text-[#1565C0]" : "text-gray-400"} />
                </button>
                {latitude && longitude && (
                  <button
                    type="button"
                    onClick={() => { setLatitude(null); setLongitude(null); }}
                    className="text-xs text-red-500 hover:text-red-600 mt-1 ml-1"
                  >
                    Remover localização
                  </button>
                )}
              </div>

              {/* Map Picker Modal */}
              {showMapPicker && (
                <MapPicker
                  initialLatitude={latitude || undefined}
                  initialLongitude={longitude || undefined}
                  province={watch("province")}
                  municipality={watch("municipality")}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setShowMapPicker(false);
                  }}
                  onClose={() => setShowMapPicker(false)}
                />
              )}

              <div>
                <label className={labelCls}>Senha</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...regReg("password")} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#6B7280]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.password?.message} />
              </div>

              <div>
                <label className={labelCls}>Confirmar senha</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...regReg("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-2.5 text-[#6B7280]">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.confirmPassword?.message} />
              </div>

              <button type="submit" className="w-full text-white py-3 text-sm font-medium rounded-full transition-colors" style={{ backgroundColor: accentColor }}>
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
      <ForgotPasswordModal open={showForgotPwd} onClose={() => setShowForgotPwd(false)} storeType="servicos-profissionais" accentColor={accentColor} />
    </main>
  );
}
