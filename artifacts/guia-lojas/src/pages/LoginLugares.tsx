import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, MapPin, Navigation } from "lucide-react";
import { adminLogin, createPlace } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import MapPicker from "@/components/MapPicker";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";
import LocationCombobox from "@/components/LocationCombobox";
import { getLocalities } from "@/lib/locationIndex";

const LUGARES_CATEGORIES = [
  "Igreja",
  "Saúde",
  "Segurança",
  "Educação",
  "Correios",
  "Administração",
  "Lazer & Cultura",
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
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const inputCls =
  "w-full border border-[#E8CC91] bg-white py-3 px-4 text-sm text-[#111111] placeholder:text-[#6F6F6F] outline-none focus:border-[#A96F12] focus:ring-2 focus:ring-[#A96F12]/10 transition-all rounded-xl";
const labelCls = "block text-xs text-[#6F6F6F] font-semibold uppercase tracking-wider mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function LoginLugares() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

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
      await adminLogin(values.phone, values.password);
      localStorage.setItem("lugares-admin", JSON.stringify({ phone: values.phone, at: Date.now() }));
      setSubmitted(true);
      setTimeout(() => (window.location.href = "/admin-lugares"), 1000);
    } catch (err: any) {
      setError(err.message || "Não foi possível entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const cats = values.categories ?? [];
      await createPlace({
        name: values.storeName,
        kind: cats.some((c) => c.toLowerCase().includes("igreja")) ? "igreja" : "servico-publico",
        category: cats[0] || "",
        address: values.address,
        province: values.province,
        municipality: values.municipality,
        locality: values.locality || "",
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        phone: values.phone,
        source: "comunidade",
      } as any);
      setSubmitted(true);
      setTimeout(() => (window.location.href = "/lugares"), 1500);
    } catch (err: any) {
      setError(err.message || "Não foi possível registar.");
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1380px] px-6 py-8 md:px-12">
        <button
          onClick={() => (window.location.href = "/lugares")}
          className="flex items-center gap-2 text-sm text-[#A96F12] hover:text-[#111111] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo-yesola-icon-dark.png" alt="YESOLA" className="w-10 h-10" loading="lazy" decoding="async" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#111111" }}>YESOLA<small style={{ display: "block", color: "#A96F12", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Lugares</small></span>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#E8CC91]">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m
                    ? "border-[#A96F12] text-[#A96F12]"
                    : "border-transparent text-[#6F6F6F] hover:text-[#A96F12]"
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
              <p className="text-sm font-medium text-[#A96F12] mb-1">
                {mode === "login" ? "Login realizado com sucesso!" : "Lugar registado com sucesso!"}
              </p>
              <p className="text-xs text-[#6F6F6F] mb-6">Redirecionando...</p>
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
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#6F6F6F]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={loginErr.password?.message} />
              </div>

              <p className="text-[11px] text-[#6F6F6F]">Acesso reservado à administração de lugares.</p>

              <button type="submit" className="w-full bg-[#A96F12] text-white py-3 text-sm font-medium rounded-full hover:bg-[#111111] transition-colors">
                Entrar
              </button>
            </form>
          ) : (
            <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Nome do Lugar</label>
                <input type="text" placeholder="Nome da igreja ou serviço" className={inputCls} {...regReg("storeName")} />
                <FieldError msg={regErr.storeName?.message} />
              </div>

              <div>
                <label className={labelCls}>Número de Telefone</label>
                <input type="tel" placeholder="Ex: 999999999" className={inputCls} {...regReg("phone")} />
                <FieldError msg={regErr.phone?.message} />
              </div>

              <div>
                <label className={labelCls}>Categorias (até 4)</label>
                <CategoryMultiSelect options={LUGARES_CATEGORIES} value={watch("categories") ?? []} onChange={(next)=>{setValue("categories", next, {shouldValidate:true}); setValue("category", next[0] || "", {shouldValidate:true});}} accent="#A96F12" />
                <FieldError msg={regErr.categories?.message} />
              </div>

              <div>
                <label className={labelCls}>Província (Angola)</label>
                <LocationCombobox value={watch("province") ?? ""} options={ANGOLA_PROVINCES.map(p=>p.name)} onChange={(v)=>{setValue("province", v, {shouldValidate:true}); setValue("municipality","",{shouldValidate:true}); setValue("locality","",{shouldValidate:true});}} placeholder="Selecione a Província" accent="#A96F12" />
                <FieldError msg={regErr.province?.message} />
              </div>

              <div>
                <label className={labelCls}>Município</label>
                <LocationCombobox value={watch("municipality") ?? ""} options={municipalities} onChange={(v)=>{setValue("municipality", v, {shouldValidate:true}); setValue("locality","",{shouldValidate:true});}} placeholder={selectedProvinceName ? "Selecione o Município" : "Selecione a província primeiro"} disabled={!selectedProvinceName} accent="#A96F12" />
                <FieldError msg={regErr.municipality?.message} />
              </div>

              <div>
                <label className={labelCls}>Localidade exacta (opcional)</label>
                <LocationCombobox value={watch("locality") ?? ""} options={getLocalities(watch("province") ?? "", watch("municipality") ?? "")} onChange={(v)=>setValue("locality", v, {shouldValidate:true})} placeholder="Ex: Benfica, Cazenga..." disabled={!watch("municipality")} accent="#A96F12" />
              </div>

              <div>
                <label className={labelCls}>Endereço detalhado</label>
                <input type="text" placeholder="Rua, Bairro, ponto de referência" className={inputCls} {...regReg("address")} />
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

              <button type="submit" className="w-full bg-[#A96F12] text-white py-3 text-sm font-medium rounded-full hover:bg-[#111111] transition-colors">
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
