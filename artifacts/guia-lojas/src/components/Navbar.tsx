import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location, setLoc] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      <div 
        className="backdrop-blur-md bg-white/95 border-b border-yellow-200/50"
        style={{background: scrolled ? 'linear-gradient(135deg, rgba(234,179,8,0.95) 0%, rgba(217,119,6,0.95) 100%)' : 'linear-gradient(135deg, #EAB308 0%, #D97706 50%, #B45309 100%)'}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img 
                    src="/logo-eliora.svg" 
                    alt="Eliora Collection" 
                    className="w-10 h-10 transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Eliora<span className="font-light opacity-90">Collection</span>
                </span>
              </div>
            </Link>

            {/* Center nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/", label: "Início" },
                { href: "/busca", label: "Explorar" },
                { href: "/descobrir-estilo", label: "Estilo" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      isActive(link.href)
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/busca">
                <button className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all" data-testid="button-nav-search">
                  <Search size={18} />
                </button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard">
                    <span className="flex items-center gap-2 text-sm font-medium text-white bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all cursor-pointer">
                      <User size={15} />
                      Painel
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <span className="text-sm text-white/90 hover:text-white px-3 py-2 transition-colors">
                      Entrar
                    </span>
                  </Link>
                  <Link href="/dashboard">
                    <span className="text-sm bg-white text-yellow-700 px-5 py-2 rounded-full font-semibold hover:bg-white/90 hover:shadow-lg transition-all">
                      Cadastrar loja
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              data-testid="button-mobile-menu"
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-yellow-200/50"
            style={{background: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)'}}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {[
                { href: "/", label: "Início" },
                { href: "/busca", label: "Explorar" },
                { href: "/descobrir-estilo", label: "Descobrir Estilo" },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span className={`block px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive(link.href)
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/90 hover:bg-white/10"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="h-px bg-white/20 my-2" />
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="block px-4 py-3 rounded-xl text-sm text-white font-medium bg-white/10">
                      Meu Painel
                    </span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-all"
                  >
                    Sair da Conta
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <span className="block px-4 py-3 rounded-xl text-sm text-white/90 hover:bg-white/10 transition-all">
                      Entrar
                    </span>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="block px-4 py-3 rounded-xl text-sm text-yellow-700 font-semibold bg-white text-center">
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