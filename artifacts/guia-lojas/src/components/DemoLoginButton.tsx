import { useState } from "react";
import { Sparkles } from "lucide-react";
import { loginLojista } from "@/lib/api";
import { dashboardPathForUser } from "@/lib/session";

const DEMO_PHONE = "999000111";
const DEMO_PASSWORD = "Apple1234";

interface DemoLoginButtonProps {
  storeType?: string;
  label?: string;
  floating?: boolean;
  className?: string;
}

export function DemoLoginButton({
  storeType = "collection",
  label = "Entrar na demonstração",
  floating = false,
  className = "",
}: DemoLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const enter = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await loginLojista({
        phone: DEMO_PHONE,
        password: DEMO_PASSWORD,
        storeType,
      });
      localStorage.setItem("guialocal_user", JSON.stringify(res.user));
      localStorage.setItem("eliora-selected-store", storeType);
      window.location.href = dashboardPathForUser({ ...res.user, storeType });
    } catch {
      setError("Demonstração indisponível. Tente novamente.");
      setLoading(false);
    }
  };

  const button = (
    <button
      type="button"
      onClick={enter}
      disabled={loading}
      data-testid="button-demo-login"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-black disabled:opacity-60 ${className}`}
    >
      <Sparkles size={15} />
      {loading ? "A entrar..." : label}
    </button>
  );

  if (floating) {
    return (
      <div
        className="fixed inset-x-3 bottom-3 z-[70] flex flex-col items-center gap-1 sm:inset-x-auto sm:right-4 sm:items-end"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {button}
        {error && <p className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-red-600 shadow">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {button}
      {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
