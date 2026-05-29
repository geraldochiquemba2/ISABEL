import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function CleanInput({ field, type = "text", placeholder, testId }: {
  field: object; type?: string; placeholder?: string; testId?: string;
}) {
  const [show, setShow] = useState(false);
  const actualType = type === "password" ? (show ? "text" : "password") : type;
  return (
    <div className="relative">
      <input
        data-testid={testId}
        type={actualType}
        placeholder={placeholder}
        className="w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors pr-8"
        {...(field as object)}
      />
      {type === "password" && (
        <button type="button" onClick={() => setShow(!show)} className="absolute right-0 top-2.5 text-muted-foreground">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] flex">
        {/* Left — decorative */}
        <div className="hidden lg:flex flex-col justify-between w-5/12 bg-muted p-12">
          <Link href="/">
            <span className="text-sm font-medium text-foreground">Guia<span className="font-light">Local</span></span>
          </Link>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Depoimento</p>
            <blockquote className="text-xl font-light text-foreground leading-relaxed">
              "Encontrei um excelente salão de beleza a dois quarteirões de casa. Nunca teria achado sem o GuiaLocal."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-4">— Maria, São Paulo</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 GuiaLocal</p>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mode toggle */}
            <div className="flex gap-6 mb-10 border-b border-border">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  data-testid={`tab-${m}`}
                  onClick={() => { setMode(m); setSubmitted(false); }}
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
                <p className="text-sm text-muted-foreground mb-8">
                  {mode === "login" ? "Entre para continuar." : "Cadastre-se gratuitamente."}
                </p>
              </motion.div>
            </AnimatePresence>

            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <p className="text-sm font-medium text-foreground mb-1">
                  {mode === "login" ? "Login realizado!" : "Conta criada!"}
                </p>
                <p className="text-xs text-muted-foreground mb-6">Modo demonstração — sem autenticação real</p>
                <Link href="/">
                  <span className="text-sm font-medium text-foreground underline">Ir para o início</span>
                </Link>
              </motion.div>
            ) : mode === "login" ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(() => setSubmitted(true))} className="space-y-6">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">E-mail</FormLabel>
                      <FormControl><CleanInput field={field} type="email" placeholder="seu@email.com" testId="input-login-email" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">Senha</FormLabel>
                      <FormControl><CleanInput field={field} type="password" placeholder="••••••••" testId="input-login-password" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <button data-testid="button-login-submit" type="submit" className="w-full bg-foreground text-background py-3 text-sm font-medium rounded-full hover:opacity-80 transition-opacity mt-2">
                    Entrar
                  </button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(() => setSubmitted(true))} className="space-y-5">
                  {[
                    { name: "name" as const, label: "Nome", type: "text", placeholder: "Seu nome", testId: "input-register-name" },
                    { name: "email" as const, label: "E-mail", type: "email", placeholder: "seu@email.com", testId: "input-register-email" },
                    { name: "password" as const, label: "Senha", type: "password", placeholder: "••••••••", testId: "input-register-password" },
                    { name: "confirmPassword" as const, label: "Confirmar senha", type: "password", placeholder: "••••••••", testId: "input-register-confirm" },
                  ].map((f) => (
                    <FormField key={f.name} control={registerForm.control} name={f.name} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">{f.label}</FormLabel>
                        <FormControl><CleanInput field={field} type={f.type} placeholder={f.placeholder} testId={f.testId} /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                  ))}
                  <button data-testid="button-register-submit" type="submit" className="w-full bg-foreground text-background py-3 text-sm font-medium rounded-full hover:opacity-80 transition-opacity mt-2">
                    Criar conta
                  </button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
