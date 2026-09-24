import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import {
  searchLocalities,
  type LocalityEntry,
  type Scope,
  type ScopeKind,
} from "@/lib/locationIndex";

export type { Scope };
export type { ScopeKind };

interface Props {
  /** Chamado ao escolher âmbito (após selecionar localidade). */
  onScope: (scope: Scope) => void;
  /** Chamado ao limpar. */
  onClear?: () => void;
  accent?: string;
  placeholder?: string;
}

/**
 * 2ª barra da pesquisa por proximidade: "Onde procuras?"
 * - Sem sugestões antes de escrever; a partir da 1ª letra mostra até 5,
 *   em overlay (não empurra conteúdo).
 * - Localidades ambíguas vêm desambiguadas ("Benfica — Belas, Luanda").
 * - Após escolher, oferece 3 âmbitos: local+próximas · município · província.
 */
export default function WhereSearch({
  onScope,
  onClear,
  accent = "#171717",
  placeholder = "Onde procuras?",
}: Props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<LocalityEntry | null>(null);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const suggestions = useMemo(() => searchLocalities(text, 5), [text]);

  useEffect(() => {
    setHighlight(0);
  }, [text]);

  const pick = (e: LocalityEntry) => {
    setPicked(e);
    setText(e.label);
    setOpen(false);
    inputRef.current?.blur();
  };

  const clear = () => {
    setPicked(null);
    setText("");
    setOpen(false);
    onClear?.();
  };

  const chooseScope = (kind: ScopeKind) => {
    if (!picked) return;
    onScope({
      kind,
      locality: picked.locality,
      municipality: picked.municipality,
      province: picked.province,
    });
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        className="flex items-center gap-2 w-full border border-gray-200 rounded-2xl bg-white py-3 px-4 text-sm cursor-text"
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        <MapPin size={16} style={{ color: accent }} className="flex-shrink-0" />
        <input
          ref={inputRef}
          value={text}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value !== picked?.label) setPicked(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            else if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => (suggestions.length ? (h + 1) % suggestions.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => (suggestions.length ? (h - 1 + suggestions.length) % suggestions.length : 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions.length > 0) pick(suggestions[highlight] ?? suggestions[0]);
            }
          }}
          className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-gray-400"
        />
        {text ? (
          <button type="button" onClick={clear} aria-label="Limpar">
            <X size={15} className="text-gray-400" />
          </button>
        ) : (
          <Search size={15} className="text-gray-400" />
        )}
      </div>

      {open && text.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-500">Nenhuma localização encontrada.</p>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => pick(s)}
                onMouseEnter={() => setHighlight(i)}
                aria-selected={i === highlight}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                  i === highlight ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            ))
          )}
        </div>
      )}

      {picked && (
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => chooseScope("nearby")}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            <MapPin size={15} /> {picked.locality} + localizações próximas
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => chooseScope("municipality")}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Todo o Município de {picked.municipality}
            </button>
            <button
              type="button"
              onClick={() => chooseScope("province")}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Toda a Província de {picked.province}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
