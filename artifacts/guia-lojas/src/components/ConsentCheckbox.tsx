import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Checkbox única de consentimento (Lei 22/11, art. 12): consentimento
// inequívoco e expresso do titular, livre, específico e informado.
// Usada em TODOS os formulários de criação de conta (24 verticais).
//
// Os documentos abrem num painel por cima do formulário (iframe), NÃO em
// separador novo: ao fechar, o utilizador cai exactamente onde estava no
// registo, com tudo o que já preencheu intacto.
export default function ConsentCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  const [open, setOpen] = useState<null | "privacidade" | "termos">(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const linkCls =
    "underline underline-offset-2 text-[#A96F12] hover:text-[#C99432]";

  return (
    <div>
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#A96F12]"
        />
        <span className="text-xs leading-5 text-gray-600">
          Li e aceito a{" "}
          <button
            type="button"
            className={linkCls}
            onClick={(e) => {
              e.stopPropagation();
              setOpen("privacidade");
            }}
          >
            Política de Privacidade
          </button>{" "}
          e os{" "}
          <button
            type="button"
            className={linkCls}
            onClick={(e) => {
              e.stopPropagation();
              setOpen("termos");
            }}
          >
            Termos de Uso
          </button>
          , nos termos da Lei n.º 22/11 (Protecção de Dados Pessoais, Angola).
        </span>
      </label>
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl h-[88dvh] sm:h-[85dvh] sm:rounded-2xl rounded-t-3xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
              {(["privacidade", "termos"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOpen(t)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    open === t
                      ? "bg-[#111111] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t === "privacidade" ? "Privacidade" : "Termos de Uso"}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Fechar"
                className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <iframe
              title={open === "privacidade" ? "Política de Privacidade" : "Termos de Uso"}
              src={open === "privacidade" ? "/privacidade" : "/termos"}
              className="flex-1 w-full border-0 bg-white"
            />
            <div className="p-3 border-t border-gray-100 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="w-full bg-[#111111] text-white py-3 rounded-xl text-sm font-medium"
              >
                Voltar ao registo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
