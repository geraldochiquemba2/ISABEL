import { Check } from "lucide-react";
import { MAX_STORE_CATEGORIES } from "@/lib/storeCategories";

type Option = string | { id: string; name: string };

function optLabel(o: Option): string {
  return typeof o === "string" ? o : o.name;
}

function optKey(o: Option): string {
  return typeof o === "string" ? o : o.id;
}

interface Props {
  /** Opções (nomes das categorias da área). */
  options: Option[];
  /** Valores selecionados (nomes). */
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  /** Cor de destaque da área (pílula ativa). */
  accent?: string;
}

/**
 * Seleção de até N categorias (pílulas). Usado no cadastro e na Minha Loja.
 * A 1ª selecionada é a categoria principal.
 */
export default function CategoryMultiSelect({
  options,
  value,
  onChange,
  max = MAX_STORE_CATEGORIES,
  accent = "#171717",
}: Props) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (label: string) => {
    if (selected.includes(label)) {
      onChange(selected.filter((v) => v !== label));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, label]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const label = optLabel(o);
          const active = selected.includes(label);
          const disabled = !active && selected.length >= max;
          return (
            <button
              key={optKey(o)}
              type="button"
              disabled={disabled}
              onClick={() => toggle(label)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active ? "text-white" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              style={active ? { backgroundColor: accent, borderColor: accent } : undefined}
            >
              {active && <Check size={12} />}
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-500 mt-2">
        {selected.length === 0
          ? `Selecione até ${max} categorias`
          : `${selected.length}/${max} selecionada${selected.length > 1 ? "s" : ""} · a 1ª é a principal`}
      </p>
    </div>
  );
}
