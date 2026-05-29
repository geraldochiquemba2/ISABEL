import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
              { href: "/favoritos", label: "Favoritos" },
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
            <Link href="/favoritos">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-nav-favorites">
                <Heart size={18} />
              </button>
            </Link>
            <div className="w-px h-4 bg-border" />
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
              {[
                { href: "/", label: "Início" },
                { href: "/busca", label: "Explorar" },
                { href: "/favoritos", label: "Favoritos" },
                { href: "/login", label: "Entrar" },
                { href: "/dashboard", label: "Cadastrar minha loja" },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span className="block px-2 py-2.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
