import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { PageTransition } from "@/components/PageTransition";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onLoginSubmit(_data: LoginValues) {
    setSubmitted(true);
  }

  function onRegisterSubmit(_data: RegisterValues) {
    setSubmitted(true);
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] flex">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">GuiaLocal</span>
            </div>
          </Link>
          <div>
            <blockquote className="text-2xl font-semibold text-white leading-relaxed max-w-sm">
              "Encontre o que precisa, onde estiver — lojas e servicos do seu bairro na palma da mao."
            </blockquote>
            <div className="mt-8 flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20"
                />
              ))}
            </div>
          </div>
          <p className="text-white/50 text-xs">© 2024 GuiaLocal. Todos os direitos reservados.</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 w-fit">
                <button
                  data-testid="tab-login"
                  onClick={() => { setMode("login"); setSubmitted(false); }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "login"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Entrar
                </button>
                <button
                  data-testid="tab-register"
                  onClick={() => { setMode("register"); setSubmitted(false); }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "register"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-foreground">
                    {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {mode === "login"
                      ? "Acesse sua conta para continuar."
                      : "Cadastre-se gratuitamente."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center"
              >
                <p className="text-emerald-700 font-semibold text-sm">
                  {mode === "login" ? "Login realizado com sucesso!" : "Conta criada com sucesso!"}
                </p>
                <p className="text-emerald-600 text-xs mt-1">
                  (Modo demonstracao — sem autenticacao real)
                </p>
                <Link href="/">
                  <Button className="mt-4 w-full" size="sm">Ir para o inicio</Button>
                </Link>
              </motion.div>
            ) : mode === "login" ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-login-email"
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              data-testid="input-login-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    data-testid="button-login-submit"
                    type="submit"
                    className="w-full mt-2"
                  >
                    Entrar
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-register-name"
                            placeholder="Seu nome"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-register-email"
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-register-password"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-register-confirm"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    data-testid="button-register-submit"
                    type="submit"
                    className="w-full mt-2"
                  >
                    Criar conta
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
