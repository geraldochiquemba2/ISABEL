import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import {
  hasAcceptedTerms,
  persistTermsAcceptance,
  saveTermsAcceptanceLocal,
  syncTermsAcceptanceFromAccount,
  TERMS_VERSION,
} from "@/lib/terms";

type Guard = (action: () => void) => void;

const TermsContext = createContext<{ guard: Guard }>({ guard: (action) => action() });

export function useTermsGate() {
  return useContext(TermsContext);
}

export function TermsGateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    syncTermsAcceptanceFromAccount().catch(() => {});
  }, []);

  const guard = useCallback<Guard>((action) => {
    if (hasAcceptedTerms()) {
      action();
      return;
    }
    pending.current = action;
    setChecked(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    pending.current = null;
    setOpen(false);
  }, []);

  const accept = useCallback(() => {
    if (!checked || saving) return;
    setSaving(true);
    const acceptedAt = new Date().toISOString();
    // Guarda localmente de imediato e sincroniza com a conta em segundo plano:
    // a ação pendente (abrir WhatsApp/ligar) corre ainda dentro do gesto do
    // utilizador, para o navegador não bloquear a nova janela.
    saveTermsAcceptanceLocal(acceptedAt, TERMS_VERSION);
    void persistTermsAcceptance(acceptedAt, TERMS_VERSION).catch(() => {});
    setSaving(false);
    setOpen(false);
    const action = pending.current;
    pending.current = null;
    action?.();
  }, [checked, saving]);

  return (
    <TermsContext.Provider value={{ guard }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:max-w-md bg-[#FBF7EC] border border-[#E9D9B6] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-[#D8B532] text-white grid place-items-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-[#171717]">Termos e Condições</h2>
                    <p className="text-[11px] text-[#77736D]">Versão {TERMS_VERSION}</p>
                  </div>
                </div>
                <button onClick={close} aria-label="Fechar" className="p-1.5 rounded-full text-[#77736D] hover:bg-[#E9D9B6]/50 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-[#171717]/80">
                Antes de falar com a loja, leia e aceite os nossos{" "}
                <a href="/termos" target="_blank" rel="noopener noreferrer" className="font-medium text-[#A96F12] underline underline-offset-2">Termos e Condições</a>{" "}
                e a{" "}
                <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="font-medium text-[#A96F12] underline underline-offset-2">Política de Privacidade</a>.
                A YESOLA é uma montra digital: a compra e a entrega são combinadas diretamente com o vendedor.
              </p>

              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E9D9B6] bg-white/70 p-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#D8B532] text-[#D8B532] focus:ring-[#D8B532]"
                  style={{ accentColor: "#D8B532" }}
                />
                <span className="text-sm font-medium text-[#171717]">Li e aceito os Termos e Condições</span>
              </label>

              <button
                onClick={accept}
                disabled={!checked || saving}
                className="mt-5 w-full rounded-full bg-[#D8B532] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B8962A] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? "A guardar..." : "Aceitar e continuar"}
              </button>
              <p className="mt-3 text-center text-[11px] text-[#77736D]">
                Guardamos a data e a versão aceite para não voltar a perguntar.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TermsContext.Provider>
  );
}
