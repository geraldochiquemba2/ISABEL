import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import { loginLojista, registerLojista } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import MapPicker from "@/components/MapPicker";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import LocationCombobox from "@/components/LocationCombobox";
import { getLocalities } from "@/lib/locationIndex";

const LOVE_CATEGORIES = [
  "Actos de Amor, Homenagens e Experiências",
  "Presentes, Flores & Surpresas",
  "Apoio & Companhia a Idosos",
  "Entregas & Gestos Especiais",
  "Assistência a Pessoas & Famílias",
  "Fotografia e Videomakers",
  "Gestão do Lar e Refeições",
  "Burocracias",
];

const loginSchema = z.object({
  phone: z.string().regex(/^\d{9}$/, "Número deve ter exatamente 9 dígitos"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  storeName: z.string().min(2, "Nome muito curto").regex(/[a-zA-ZáàâãéèêíïóôõúüçÁÀÂÃÉÈÊÍÏÓÔÕÚÜÇ]/, "O nome deve conter pelo menos uma letra"),
  phone: z.string().regex(/^\d{9}$/, "Número deve ter exatamente 9 dígitos"),
  category: z.string().min(1, "Selecione a categoria"),
  categories: z.array(z.string()).min(1, "Selecione pelo menos 1 categoria").max(4, "Máximo 4 categorias"),
  locality: z.string().optional(),
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

const inputCls =
  "w-full border border-[#F7E9EB] bg-white py-3 px-4 text-sm text-[#171416] placeholder:text-[#6F696B] outline-none focus:border-[#171416] focus:ring-2 focus:ring-[#171416]/10 transition-all rounded-xl";
const labelCls = "block text-xs text-[#6F696B] font-semibold uppercase tracking-wider mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function LoginLove() {
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
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { categories: [] as string[], locality: "" } });

  const selectedProvinceName = watch("province");
  const selectedProvince = ANGOLA_PROVINCES.find((p) => p.name === selectedProvinceName);
  const municipalities = selectedProvince ? selectedProvince.municipalities : [];

  const onLoginSubmit = async (values: LoginValues) => {
    setError("");
    try {
      const res = await loginLojista({ ...values, storeType: "love-services" });
      const user = res.user;
      localStorage.setItem("guialocal_user", JSON.stringify({ ...user, storeType: "love-services" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-love"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const res = await registerLojista({ ...values, storeType: "love-services", latitude: latitude || undefined, longitude: longitude || undefined });
      localStorage.setItem("guialocal_user", JSON.stringify({ ...res.user, storeType: "love-services" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-love"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#F7E9EB] text-[#791226]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1380px] px-6 py-8 md:px-12">
        <button
          onClick={() => window.location.href = "/love-services"}
          className="flex items-center gap-2 text-sm text-[#527078] hover:text-[#791226] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo-yesola-icon-dark.png" alt="YESOLA Love Services" className="w-10 h-10" />
            <span className="font-serif text-xl tracking-[0.08em] text-[#791226]">YESOLA <i className="font-normal">Love Services</i></span>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#ded2c3]">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m
                    ? "border-[#A71936] text-[#791226]"
                    : "border-transparent text-[#6F696B] hover:text-[#791226]"
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
              <p className="text-sm font-medium text-[#791226] mb-1">
                {mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
              </p>
              <p className="text-xs text-[#6F696B] mb-6">Redirecionando para o painel...</p>
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
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#6F696B]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={loginErr.password?.message} />
              </div>

              <button type="button" onClick={() => setShowForgotPwd(true)} className="text-xs text-[#6F696B] hover:underline mt-2 mb-2">
                Esqueci a senha?
              </button>

              <button type="submit" className="w-full bg-[#A71936] text-white py-3 text-sm font-medium rounded-full hover:bg-[#A71936] transition-colors">
                Entrar
              </button>

              <div className="text-center pt-2">
                <a href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá! Gostaria de redefinir a minha palavra-passe na YESOLA Love Services.")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6F696B] hover:text-[#791226] underline underline-offset-2 transition-colors">
                  Esqueci a minha palavra-passe
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Nome do Serviço</label>
                <input type="text" placeholder="Nome do seu serviço" className={inputCls} {...regReg("storeName")} />
                <FieldError msg={regErr.storeName?.message} />
              </div>

              <div>
                <label className={labelCls}>Número de Telefone</label>
                <input type="tel" placeholder="Ex: 999999999" className={inputCls} {...regReg("phone")} />
                <FieldError msg={regErr.phone?.message} />
              </div>

              <div>
                <label className={labelCls}>Categorias (até 4)</label>
                <CategoryMultiSelect
                  options={LOVE_CATEGORIES}
                  value={watch("categories") ?? []}
                  onChange={(next) => { setValue("categories", next, { shouldValidate: true }); setValue("category", next[0] || "", { shouldValidate: true }); }}
                  accent="#A71936"
                />
                <FieldError msg={regErr.categories?.message} />
              </div>

              <div>
                <label className={labelCls}>Província (Angola)</label>
                <LocationCombobox
                  options={ANGOLA_PROVINCES.map((p) => p.name)}
                  value={watch("province") ?? ""}
                  onChange={(v) => { setValue("province", v, { shouldValidate: true }); setValue("municipality", "", { shouldValidate: true }); setValue("locality", "", { shouldValidate: true }); }}
                  placeholder="Selecione a Província"
                  accent="#A71936"
                />
                <FieldError msg={regErr.province?.message} />
              </div>

              <div>
                <label className={labelCls}>Município</label>
                <LocationCombobox
                  options={municipalities}
                  value={watch("municipality") ?? ""}
                  onChange={(v) => { setValue("municipality", v, { shouldValidate: true }); setValue("locality", "", { shouldValidate: true }); }}
                  placeholder={selectedProvinceName ? "Selecione o Município" : "Selecione a província primeiro"}
                  disabled={!selectedProvinceName}
                  accent="#A71936"
                />
                <FieldError msg={regErr.municipality?.message} />
              </div>

              <div>
                <label className={labelCls}>Localidade / Bairro (Opcional)</label>
                <LocationCombobox
                  options={getLocalities(watch("province") ?? "", watch("municipality") ?? "")}
                  value={watch("locality") ?? ""}
                  onChange={(v) => setValue("locality", v, { shouldValidate: true })}
                  placeholder={watch("municipality") ? "Selecione a Localidade" : "Selecione o município primeiro"}
                  disabled={!watch("municipality")}
                  accent="#A71936"
                />
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
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#6F696B]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.password?.message} />
              </div>

              <div>
                <label className={labelCls}>Confirmar senha</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...regReg("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-2.5 text-[#6F696B]">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.confirmPassword?.message} />
              </div>

              <button type="submit" className="w-full bg-[#A71936] text-white py-3 text-sm font-medium rounded-full hover:bg-[#A71936] transition-colors">
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
      <ForgotPasswordModal open={showForgotPwd} onClose={() => setShowForgotPwd(false)} storeType="love-services" accentColor="#A71936" />
    </main>
  );
}
