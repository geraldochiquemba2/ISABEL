// Checkbox única de consentimento (Lei 22/11, art. 12): consentimento
// inequívoco e expresso do titular, livre, específico e informado.
// Usada em TODOS os formulários de criação de conta (25 verticais).
export default function ConsentCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
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
          <a href="/privacidade" target="_blank" rel="noopener" className="underline underline-offset-2 text-[#A96F12] hover:text-[#C99432]" onClick={(e) => e.stopPropagation()}>
            Política de Privacidade
          </a>{" "}
          e os{" "}
          <a href="/termos" target="_blank" rel="noopener" className="underline underline-offset-2 text-[#A96F12] hover:text-[#C99432]" onClick={(e) => e.stopPropagation()}>
            Termos de Uso
          </a>
          , nos termos da Lei n.º 22/11 (Protecção de Dados Pessoais, Angola).
        </span>
      </label>
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}
