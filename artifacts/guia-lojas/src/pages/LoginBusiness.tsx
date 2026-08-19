import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLocation as useWouterLocation } from "wouter";
import { loginLojista, registerLojista } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";

const BUSINESS_CATEGORIES = [
  "Consultoria, Estratégia e Gestão Empresarial",
  "Gestão Financeira, Contabilidade e Fiscalidade",
  "Marketing, Vendas e Posicionamento de Marca",
  "Soluções Legais, Jurídicas e Propriedade Intelectual",
  "Recursos Humanos, Talentos e Operações",
  "Finanças Pessoais, Investimentos e Captação",
];

const loginSchema = z.object({
  phone: z.string().min(9, "Número de telefone inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  storeName: z.string().min(2, "Nome muito curto"),
  phone: z.string().min(9, "Número de telefone inválido"),
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
  "w-full border border-[#d1d4d8] bg-white py-3 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#112844] focus:ring-2 focus:ring-[#112844]/10 transition-all rounded-xl";
const labelCls = "block text-xs text-[#87909a] font-semibold uppercase tracking-wider mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function LoginBusiness() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      const res = await loginLojista({ ...values, storeType: "business" });
      const user = res.user;
      localStorage.setItem("guialocal_user", JSON.stringify({ ...user, storeType: "business" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-business"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const res = await registerLojista({ ...values, storeType: "business" });
      localStorage.setItem("guialocal_user", JSON.stringify({ ...res.user, storeType: "business" }));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard-business"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#f4f1eb] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1380px] px-6 py-8 md:px-12">
        <button
          onClick={() => window.location.href = "/business"}
          className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#112844] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#112844" }}>Eliora<small style={{ display: "block", color: "#b88a3b", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Business & Finances</small></span>
          </div>

          <div className="flex gap-6 mb-8 border-b border-[#d1d4d8]">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m
                    ? "border-[#112844] text-[#112844]"
                    : "border-transparent text-[#87909a] hover:text-[#112844]"
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
              <p className="text-sm font-medium text-[#112844] mb-1">
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

              <button type="submit" className="w-full bg-[#112844] text-white py-3 text-sm font-medium rounded-full hover:bg-[#0d1f35] transition-colors">
                Entrar
              </button>

              <div className="text-center pt-2">
                <a href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá! Gostaria de redefinir a minha palavra-passe na Eliora Business & Finances.")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#87909a] hover:text-[#112844] underline underline-offset-2 transition-colors">
                  Esqueci a minha palavra-passe
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className={labelCls}>Nome da Loja</label>
                <input type="text" placeholder="Nome de sua loja/serviço" className={inputCls} {...regReg("storeName")} />
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
                  {BUSINESS_CATEGORIES.map((cat) => (
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
                <input type="text" placeholder="Rua, Bairro, Casa nº" className={inputCls} {...regReg("address")} />
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

              <button type="submit" className="w-full bg-[#112844] text-white py-3 text-sm font-medium rounded-full hover:bg-[#0d1f35] transition-colors">
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
