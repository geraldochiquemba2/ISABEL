import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import { loginLojista, registerLojista } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

const AUTOMOVEIS_CATEGORIES = [
  "Venda de Carros Novos & Usados",
  "Aluguer de Viaturas",
  "Oficinas & Mecânicos",
  "Peças & Acessórios",
  "Lavagem & Detailing",
  "Serviços de Transporte",
  "Assistência em Viagem",
  "Seguros Automóvel",
  "Inspecção & Documentação",
  "Estacionamentos & Garagens",
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

const inputCls =
  "w-full border border-[#d1d4d8] bg-white py-3 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#0f1d32] focus:ring-2 focus:ring-[#0f1d32]/10 transition-all rounded-xl";
const labelCls = "block text-xs text-[#87909a] font-semibold uppercase tracking-wider mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function LoginAutomoveis() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState(false);
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
      const res = await loginLojista({ ...values, storeType: "automoveis" });
      const user = res.user;
      localStorage.setItem("guialocal_user", JSON.stringify({ ...user, storeType: "automoveis" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-automoveis"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const res = await registerLojista({ ...values, storeType: "automoveis" });
      localStorage.setItem("guialocal_user", JSON.stringify({ ...res.user, storeType: "automoveis" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-automoveis"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#f4f6f9] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1380px] px-6 py-8 md:px-12">
        <button
          onClick={() => window.location.href = "/automoveis"}
          className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#0f1d32] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#0f1d32" }}>YESOLA<small style={{ display: "block", color: "#c9913a", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Automóveis</small></span>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#d1d4d8]">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m
                    ? "border-[#0f1d32] text-[#0f1d32]"
                    : "border-transparent text-[#87909a] hover:text-[#0f1d32]"
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
              <p className="text-sm font-medium text-[#0f1d32] mb-1">
                {mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
              </p>
              <p className="text-xs text-[#87909a] mb-6">Redirecionando para o painel...</p>
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
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#87909a]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={loginErr.password?.message} />
              </div>

              <button type="button" onClick={() => setShowForgotPwd(true)} className="text-xs text-[#87909a] hover:underline mt-2 mb-2">
                Esqueci a senha?
              </button>

              <button type="submit" className="w-full bg-[#0f1d32] text-white py-3 text-sm font-medium rounded-full hover:bg-[#0a1525] transition-colors">
                Entrar
              </button>

              <div className="text-center pt-2">
                <a href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá! Gostaria de redefinir a minha palavra-passe na YESOLA Automóveis & Mobilidade.")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#87909a] hover:text-[#0f1d32] underline underline-offset-2 transition-colors">
                  Esqueci a minha palavra-passe
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Nome da Loja</label>
                <input type="text" placeholder="Nome da sua loja/oficina" className={inputCls} {...regReg("storeName")} />
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
                  {AUTOMOVEIS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-[#30343a]">
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
                    <option key={p.name} value={p.name} className="bg-white text-[#30343a]">{p.name}</option>
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
                    <option key={m} value={m} className="bg-white text-[#30343a]">{m}</option>
                  ))}
                </select>
                <FieldError msg={regErr.municipality?.message} />
              </div>

              <div>
                <label className={labelCls}>Endereço detalhado</label>
                <input type="text" placeholder="Rua, Bairro, Nº" className={inputCls} {...regReg("address")} />
                <FieldError msg={regErr.address?.message} />
              </div>

              <div>
                <label className={labelCls}>Senha</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...regReg("password")} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-0 top-2.5 text-[#87909a]">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.password?.message} />
              </div>

              <div>
                <label className={labelCls}>Confirmar senha</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-8`} {...regReg("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-2.5 text-[#87909a]">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError msg={regErr.confirmPassword?.message} />
              </div>

              <button type="submit" className="w-full bg-[#0f1d32] text-white py-3 text-sm font-medium rounded-full hover:bg-[#0a1525] transition-colors">
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
      <ForgotPasswordModal open={showForgotPwd} onClose={() => setShowForgotPwd(false)} storeType="automoveis" accentColor="#c9913a" />
    </main>
  );
}
