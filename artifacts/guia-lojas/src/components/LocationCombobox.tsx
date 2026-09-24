import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

interface Props {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  accent?: string;
  testId?: string;
  maxShown?: number;
  /** Quando true, permite Enter com texto livre mesmo sem correspondência (para bairros ainda sem cadastro). */
  allowCustom?: boolean;
}

/**
 * Campo de seleção COM pesquisa (combobox).
 * - Ao focar/clicar mostra as opções mesmo antes de escrever.
 * - Ao escrever filtra (prefixo primeiro).
 * - Enter escolhe a 1ª correspondência (ou texto livre se allowCustom); Escape fecha; X limpa.
 * - Dropdown em overlay absoluto (não empurra conteúdo).
 */
export default function LocationCombobox({
  label,
  value,
  options,
  onChange,
  placeholder = "Selecione",
  disabled = false,
  accent = "#171717",
  testId,
  maxShown = 50,
  allowCustom = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setText("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = norm(text);
    const uniq = Array.from(new Set((options || []).filter(Boolean)));
    if (!q) return uniq.slice(0, maxShown);
    const starts: string[] = [];
    const contains: string[] = [];
    for (const o of uniq) {
      const n = norm(o);
      if (n.startsWith(q)) starts.push(o);
      else if (n.includes(q)) contains.push(o);
    }
    return [...starts, ...contains].slice(0, maxShown);
  }, [options, text, maxShown]);

  const commit = (v: string) => {
    onChange(v);
    setOpen(false);
    setText("");
    inputRef.current?.blur();
  };

  return (
    <div ref={rootRef} className="relative">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 w-full border rounded-xl bg-white py-2.5 px-3 text-sm transition-colors ${
          disabled ? "opacity-50 bg-gray-50" : "cursor-text"
        }`}
        style={{ borderColor: open ? accent : undefined }}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          value={open ? text : value}
          disabled={disabled}
          placeholder={value || placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setText("");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => (filtered.length ? (h + 1) % filtered.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => (filtered.length ? (h - 1 + filtered.length) % filtered.length : 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length > 0) commit(filtered[highlight] ?? filtered[0]);
              else if (allowCustom && text.trim()) commit(text.trim());
            }
          }}
          data-testid={testId}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-gray-400"
        />
        {value && !disabled ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              commit("");
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Limpar"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
        )}
      </div>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            allowCustom && text.trim() ? (
              <button
                type="button"
                onClick={() => commit(text.trim())}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  Usar &quot;{text.trim()}&quot;
                </span>
              </button>
            ) : (
              <p className="px-3 py-3 text-xs text-gray-500">Sem correspondências.</p>
            )
          ) : (
            filtered.map((o, i) => (
              <button
                key={o}
                type="button"
                onClick={() => commit(o)}
                onMouseEnter={() => setHighlight(i)}
                aria-selected={i === highlight}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors ${
                  i === highlight ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{o}</span>
                {o === value && <Check size={14} style={{ color: accent }} className="flex-shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
