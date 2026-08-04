import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useLocation as useWouterLocation } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { CATEGORIES } from "@/data/mock";
import { registerLojista, loginLojista } from "@/lib/api";

/* ── schemas ─────────────────────────────────────────────── */
const loginSchema = z.object({
  phone: z.string().min(9, "Número de telefone inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z
  .object({
    storeName: z.string().min(2, "Nome da loja muito curto"),
    phone: z.string().min(9, "Número de telefone inválido"),
    category: z.string().min(1, "Selecione a categoria"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
    province: z.string().min(1, "Selecione a província"),
    municipality: z.string().min(1, "Selecione o município"),
    address: z.string().min(5, "Endereço muito curto"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

/* ── small helpers ───────────────────────────────────────── */
const inputCls =
  "w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors";

const labelCls = "block text-xs text-black font-semibold uppercase tracking-widest mb-1";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

/* ── component ───────────────────────────────────────────── */
export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, setLoc] = useWouterLocation();

  /* login form */
  const {
    register: loginReg,
    handleSubmit: loginSubmit,
    formState: { errors: loginErr },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  /* register form */
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
      const res = await loginLojista(values);
      localStorage.setItem("guialocal_user", JSON.stringify(res.user));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao entrar.");
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const res = await registerLojista(values);
      localStorage.setItem("guialocal_user", JSON.stringify(res.user));
      setSubmitted(true);
      setTimeout(() => setLoc("/dashboard"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar conta.");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] flex">
        {/* Left — decorative */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 bg-muted p-12">
          <Link href="/">
            <span className="text-sm font-medium text-foreground">
              Eliora<span className="font-light">Collection</span>
            </span>
          </Link>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Depoimento</p>
            <blockquote className="text-xl font-light text-foreground leading-relaxed">
              "Encontrei um excelente salão de beleza a dois quarteirões de casa. Nunca teria achado sem a Eliora Collection."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-4">— Maria, Luanda</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 Eliora Collection</p>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-sm py-8">
            {/* Tabs */}
            <div className="flex gap-6 mb-10 border-b border-border">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSubmitted(false); setError(""); }}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    mode === m
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <h1 className="text-2xl font-semibold text-foreground mb-1 tracking-tight">
                  {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
                </h1>
                <p className="text-sm text-black mb-8">
                  {mode === "login" ? "Entre para continuar." : "Cadastre-se gratuitamente."}
                </p>
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs mb-6 font-medium">
                {error}
              </div>
            )}

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <p className="text-sm font-medium text-foreground mb-1">
                  {mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
                </p>
                <p className="text-xs text-black mb-6">Redirecionando para o painel...</p>
              </motion.div>
            ) : mode === "login" ? (
              /* ── LOGIN FORM ── */
              <form onSubmit={loginSubmit(onLoginSubmit)} className="space-y-6">
                <div>
                  <label className={labelCls}>Número de Telefone</label>
                  <input
                    type="tel"
                    placeholder="Ex: 999999999"
                    className={inputCls}
                    {...loginReg("phone")}
                  />
                  <FieldError msg={loginErr.phone?.message} />
                </div>

                <div>
                  <label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputCls} pr-8`}
                      {...loginReg("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-0 top-2.5 text-muted-foreground"
                    >
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={loginErr.password?.message} />
                </div>

                <button
                  type="submit"
                  className="w-full bg-foreground text-background py-3 text-sm font-medium rounded-full hover:opacity-80 transition-opacity mt-2 border border-black"
                >
                  Entrar
                </button>

                <div className="text-center pt-2">
                  <a
                    href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá! Gostaria de redefinir a minha palavra-passe na Eliora Collection.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Esqueci a minha palavra-passe
                  </a>
                </div>
              </form>
            ) : (
              /* ── REGISTER FORM ── */
              <form onSubmit={regSubmit(onRegisterSubmit)} className="space-y-5">
                <div>
                  <label className={labelCls}>Nome da Loja</label>
                  <input
                    type="text"
                    placeholder="Nome de sua loja/serviço"
                    className={inputCls}
                    {...regReg("storeName")}
                  />
                  <FieldError msg={regErr.storeName?.message} />
                </div>

                <div>
                  <label className={labelCls}>Número de Telefone</label>
                  <input
                    type="tel"
                    placeholder="Ex: 999999999"
                    className={inputCls}
                    {...regReg("phone")}
                  />
                  <FieldError msg={regErr.phone?.message} />
                </div>

                <div>
                  <label className={labelCls}>Categoria da Loja</label>
                  <select
                    className={`${inputCls} cursor-pointer`}
                    {...regReg("category")}
                  >
                    <option value="">Selecione a categoria</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-white text-foreground">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FieldError msg={regErr.category?.message} />
                </div>

                <div>
                  <label className={labelCls}>Província (Angola)</label>
                  <select
                    className={`${inputCls} cursor-pointer`}
                    {...regReg("province", {
                      onChange: () => setValue("municipality", ""),
                    })}
                  >
                    <option value="">Selecione a Província</option>
                    {ANGOLA_PROVINCES.map((p) => (
                      <option key={p.name} value={p.name} className="bg-white text-foreground">
                        {p.name}
                      </option>
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
                    <option value="">
                      {selectedProvinceName ? "Selecione o Município" : "Selecione a província primeiro"}
                    </option>
                    {municipalities.map((m) => (
                      <option key={m} value={m} className="bg-white text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                  <FieldError msg={regErr.municipality?.message} />
                </div>

                <div>
                  <label className={labelCls}>Endereço detalhado</label>
                  <input
                    type="text"
                    placeholder="Rua, Bairro, Casa nº"
                    className={inputCls}
                    {...regReg("address")}
                  />
                  <FieldError msg={regErr.address?.message} />
                </div>

                <div>
                  <label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputCls} pr-8`}
                      {...regReg("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-0 top-2.5 text-muted-foreground"
                    >
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={regErr.password?.message} />
                </div>

                <div>
                  <label className={labelCls}>Confirmar senha</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputCls} pr-8`}
                      {...regReg("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-0 top-2.5 text-muted-foreground"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <FieldError msg={regErr.confirmPassword?.message} />
                </div>

                <button
                  type="submit"
                  className="w-full bg-foreground text-background py-3 text-sm font-medium rounded-full hover:opacity-80 transition-opacity mt-2 border border-black"
                >
                  Criar conta
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
