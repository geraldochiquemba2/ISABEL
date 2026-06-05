import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location, setLoc] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Monitor localStorage user
  useEffect(() => {
    const local = localStorage.getItem("guialocal_user");
    if (local) {
      setUser(JSON.parse(local));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("guialocal_user");
    setUser(null);
    setLoc("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Guia<span className="font-light">Local</span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: "/", label: "Início" },
              { href: "/busca", label: "Explorar" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/busca">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-nav-search">
                <Search size={18} />
              </button>
            </Link>
            <div className="w-px h-4 bg-border" />
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                    Meu Painel
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium flex items-center gap-1 ml-2"
                >
                  <LogOut size={14} /> Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Entrar
                  </span>
                </Link>
                <Link href="/dashboard">
                  <span className="text-sm bg-foreground text-background px-4 py-1.5 rounded-full font-medium hover:opacity-80 transition-opacity">
                    Cadastrar loja
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            data-testid="button-mobile-menu"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <span className="block px-2 py-2.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
                  Início
                </span>
              </Link>
              <Link href="/busca" onClick={() => setMobileOpen(false)}>
                <span className="block px-2 py-2.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
                  Explorar
                </span>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="block px-2 py-2.5 text-sm text-foreground font-semibold">
                      Meu Painel
                    </span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full text-left block px-2 py-2.5 text-sm text-red-500 font-medium"
                  >
                    Sair da Conta
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <span className="block px-2 py-2.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
                      Entrar
                    </span>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="block px-2 py-2.5 text-sm text-foreground hover:text-muted-foreground transition-colors font-medium">
                      Cadastrar minha loja
                    </span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
