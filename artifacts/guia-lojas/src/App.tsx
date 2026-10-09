import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState, createContext, useContext, useRef } from "react";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import StoreProfile from "@/pages/StoreProfile";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import DescobrirEstilo from "@/pages/DescobrirEstilo";
import ConsultoresEstilo from "@/pages/ConsultoresEstilo";
import VerCarrinhos from "@/pages/VerCarrinhos";
import ElioraWeddings from "@/pages/ElioraWeddings";
import ExploreServices from "@/pages/ExploreServices";
import ExploreWeddings from "@/pages/ExploreWeddings";
import LoginWeddings from "@/pages/LoginWeddings";
import DashboardWeddings from "@/pages/DashboardWeddings";
import StoreSelector from "@/pages/StoreSelector";
import LugaresHome from "@/pages/LugaresHome";
import AdminLugares from "@/pages/AdminLugares";
import ExploreLugares from "@/pages/ExploreLugares";
import LoginLugares from "@/pages/LoginLugares";
import MimoHome from "@/pages/MimoHome";
import LoginLove from "@/pages/LoginLove";
import DashboardLove from "@/pages/DashboardLove";
import ExploreLove from "@/pages/ExploreLove";
import BusinessHome from "@/pages/BusinessHome";
import ExploreBusiness from "@/pages/ExploreBusiness";
import LoginBusiness from "@/pages/LoginBusiness";
import DashboardBusiness from "@/pages/DashboardBusiness";
import FormacoesHome from "@/pages/FormacoesHome";
import LoginFormacoes from "@/pages/LoginFormacoes";
import DashboardFormacoes from "@/pages/DashboardFormacoes";
import ExploreFormacoes from "@/pages/ExploreFormacoes";
import EventosHome from "@/pages/EventosHome";
import ExploreEventos from "@/pages/ExploreEventos";
import LoginEventos from "@/pages/LoginEventos";
import DashboardEventos from "@/pages/DashboardEventos";
import EntretenimentoHome from "@/pages/EntretenimentoHome";
import ExploreEntretenimento from "@/pages/ExploreEntretenimento";
import LoginEntretenimento from "@/pages/LoginEntretenimento";
import DashboardEntretenimento from "@/pages/DashboardEntretenimento";
import ImoveisHome from "@/pages/ImoveisHome";
import ExploreImoveis from "@/pages/ExploreImoveis";
import LoginImoveis from "@/pages/LoginImoveis";
import DashboardImoveis from "@/pages/DashboardImoveis";
import InfantilHome from "@/pages/InfantilHome";
import ExploreInfantil from "@/pages/ExploreInfantil";
import LoginInfantil from "@/pages/LoginInfantil";
import DashboardInfantil from "@/pages/DashboardInfantil";
import AutomoveisHome from "@/pages/AutomoveisHome";
import ExploreAutomoveis from "@/pages/ExploreAutomoveis";
import LoginAutomoveis from "@/pages/LoginAutomoveis";
import DashboardAutomoveis from "@/pages/DashboardAutomoveis";
import SaudeHome from "@/pages/SaudeHome";
import ExploreSaude from "@/pages/ExploreSaude";
import LoginSaude from "@/pages/LoginSaude";
import DashboardSaude from "@/pages/DashboardSaude";
import BelezaHome from "@/pages/BelezaHome";
import ExploreBeleza from "@/pages/ExploreBeleza";
import LoginBeleza from "@/pages/LoginBeleza";
import DashboardBeleza from "@/pages/DashboardBeleza";
import CasaHome from "@/pages/CasaHome";
import ExploreCasa from "@/pages/ExploreCasa";
import LoginCasa from "@/pages/LoginCasa";
import DashboardCasa from "@/pages/DashboardCasa";
import TecnologiaHome from "@/pages/TecnologiaHome";
import ExploreTecnologia from "@/pages/ExploreTecnologia";
import LoginTecnologia from "@/pages/LoginTecnologia";
import DashboardTecnologia from "@/pages/DashboardTecnologia";
import AlimentacaoHome from "@/pages/AlimentacaoHome";
import ExploreAlimentacao from "@/pages/ExploreAlimentacao";
import LoginAlimentacao from "@/pages/LoginAlimentacao";
import DashboardAlimentacao from "@/pages/DashboardAlimentacao";
import TurismoHome from "@/pages/TurismoHome";
import ExploreTurismo from "@/pages/ExploreTurismo";
import LoginTurismo from "@/pages/LoginTurismo";
import DashboardTurismo from "@/pages/DashboardTurismo";
import DesportoHome from "@/pages/DesportoHome";
import ExploreDesporto from "@/pages/ExploreDesporto";
import LoginDesporto from "@/pages/LoginDesporto";
import DashboardDesporto from "@/pages/DashboardDesporto";
import EmpregosHome from "@/pages/EmpregosHome";
import ExploreEmpregos from "@/pages/ExploreEmpregos";
import LoginEmpregos from "@/pages/LoginEmpregos";
import DashboardEmpregos from "@/pages/DashboardEmpregos";
import AgriculturaHome from "@/pages/AgriculturaHome";
import ExploreAgricultura from "@/pages/ExploreAgricultura";
import LoginAgricultura from "@/pages/LoginAgricultura";
import DashboardAgricultura from "@/pages/DashboardAgricultura";
import InfluenciadoresHome from "@/pages/InfluenciadoresHome";
import ExploreInfluenciadores from "@/pages/ExploreInfluenciadores";
import LoginInfluenciadores from "@/pages/LoginInfluenciadores";
import DashboardInfluenciadores from "@/pages/DashboardInfluenciadores";
import TransportesHome from "@/pages/TransportesHome";
import ExploreTransportes from "@/pages/ExploreTransportes";
import LoginTransportes from "@/pages/LoginTransportes";
import DashboardTransportes from "@/pages/DashboardTransportes";
import ServicosProfHome from "@/pages/ServicosProfHome";
import ExploreServicosProfissionais from "@/pages/ExploreServicosProfissionais";
import LoginServicosProf from "@/pages/LoginServicosProf";
import DashboardServicosProf from "@/pages/DashboardServicosProf";
import BancosHome from "@/pages/BancosHome";
import ExploreBancos from "@/pages/ExploreBancos";
import LoginBancos from "@/pages/LoginBancos";
import DashboardBancos from "@/pages/DashboardBancos";
import SeguradorasHome from "@/pages/SeguradorasHome";
import ExploreSeguradoras from "@/pages/ExploreSeguradoras";
import LoginSeguradoras from "@/pages/LoginSeguradoras";
import DashboardSeguradoras from "@/pages/DashboardSeguradoras";
import NotFound from "@/pages/not-found";
import ExploreCollection from "@/pages/ExploreCollection";
import Proposito from "@/pages/Proposito";
import Privacidade from "@/pages/Privacidade";
import Sobre from "@/pages/Sobre";
import Contacto from "@/pages/Contacto";
import OfflineBanner from "@/components/OfflineBanner";
import { initPush } from "@/lib/push";

const queryClient = new QueryClient();

type StoreType = "weddings" | "love-services" | "collection" | "business" | "formacoes" | "eventos" | "entretenimento" | "imoveis" | "infantil" | "automoveis" | "saude" | "beleza" | "casa" | "tecnologia-electronicos" | "alimentacao-restauracao" | "turismo-lazer" | "desporto-fitness" | "empregos-oportunidades" | "agricultura-agronegocio" | "influenciadores-criadores" | "transportes-logistica" | "servicos-profissionais" | "bancos" | "seguradoras" | null;

interface StoreContextType {
  selectedStore: StoreType;
  setSelectedStore: (store: string) => void;
}

export const StoreContext = createContext<StoreContextType>({
  selectedStore: null,
  setSelectedStore: () => {},
});

export function useStore() {
  return useContext(StoreContext);
}

// Como a página foi carregada: "reload" = refresh (vai ao topo),
// "back_forward" = voltar (restaura), resto = restauro-se-houver.
function navType(): string {
  try {
    const e = (performance.getEntriesByType("navigation")[0] as any) || {};
    return e.type || "navigate";
  } catch {
    return "navigate";
  }
}

function ScrollToTop() {
  const [location] = useLocation();
  const firstRun = useRef(true);
  useEffect(() => {
    // Restaura onde parou (guardado pela memória de rolagem) ou vai ao topo.
    // A chave inclui a vertical: "/" é partilhado pelo seletor e por TODAS
    // as Homes — sem isto, escolher uma área nova caía na posição antiga.
    // Só o 1º carregamento após refresh força o topo; navegações SPA
    // seguintes usam a lógica normal (senão o type "reload" herdado do
    // documento matava o voltar).
    // Corre ANTES dos efeitos do Router (filho antes do pai) e o reforço do
    // Router só atua se ninguém mexeu — sem lutas de scroll.
    const freshReload = firstRun.current && navType() === "reload";
    firstRun.current = false;
    if (freshReload) {
      window.scrollTo(0, 0);
      return;
    }
    let saved = 0;
    try {
      saved = parseInt(sessionStorage.getItem(scrollKey()) || "0", 10) || 0;
    } catch {
      /* sem storage */
    }
    window.scrollTo(0, saved);
  }, [location]);
  return null;
}

// Chave da memória de rolagem: vertical + URL. "/" sozinho não chega porque
// o seletor e todas as Homes vivem no mesmo path.
function scrollKey(): string {
  let vertical = "none";
  try {
    vertical = localStorage.getItem("eliora-selected-store") || "none";
  } catch {
    /* sem storage */
  }
  return "scroll:" + vertical + ":" + window.location.pathname + window.location.search;
}

function inferStoreFromUrl(): StoreType {
  try {
    const url = new URL(window.location.href);
    const from = url.searchParams.get("from");
    if (!from) return null;
    const f = from.toLowerCase();
    const map: Record<string, StoreType> = {
      weddings: "weddings",
      "love-services": "love-services",
      love: "love-services",
      collection: "collection",
      business: "business",
      formacoes: "formacoes",
      eventos: "eventos",
      entretenimento: "entretenimento",
      imoveis: "imoveis",
      infantil: "infantil",
      automoveis: "automoveis",
      saude: "saude",
      beleza: "beleza",
      casa: "casa",
      tecnologia: "tecnologia-electronicos",
      "tecnologia-electronicos": "tecnologia-electronicos",
      alimentacao: "alimentacao-restauracao",
      "alimentacao-restauracao": "alimentacao-restauracao",
      turismo: "turismo-lazer",
      "turismo-lazer": "turismo-lazer",
      desporto: "desporto-fitness",
      "desporto-fitness": "desporto-fitness",
      empregos: "empregos-oportunidades",
      "empregos-oportunidades": "empregos-oportunidades",
      agricultura: "agricultura-agronegocio",
      "agricultura-agronegocio": "agricultura-agronegocio",
      influenciadores: "influenciadores-criadores",
      "influenciadores-criadores": "influenciadores-criadores",
      transportes: "transportes-logistica",
      "transportes-logistica": "transportes-logistica",
      servicos: "servicos-profissionais",
      "servicos-profissionais": "servicos-profissionais",
      "servicos-prof": "servicos-profissionais",
    };
    return map[f] ?? null;
  } catch {
    return null;
  }
}

function slugToVertical(slug: string): StoreType {
  const map: Record<string, StoreType> = {
    weddings: "weddings",
    love: "love-services",
    "love-services": "love-services",
    collection: "collection",
    business: "business",
    formacoes: "formacoes",
    eventos: "eventos",
    entretenimento: "entretenimento",
    imoveis: "imoveis",
    infantil: "infantil",
    automoveis: "automoveis",
    saude: "saude",
    beleza: "beleza",
    casa: "casa",
    tecnologia: "tecnologia-electronicos",
    "tecnologia-electronicos": "tecnologia-electronicos",
    alimentacao: "alimentacao-restauracao",
    "alimentacao-restauracao": "alimentacao-restauracao",
    turismo: "turismo-lazer",
    "turismo-lazer": "turismo-lazer",
    desporto: "desporto-fitness",
    "desporto-fitness": "desporto-fitness",
    empregos: "empregos-oportunidades",
    "empregos-oportunidades": "empregos-oportunidades",
    agricultura: "agricultura-agronegocio",
    "agricultura-agronegocio": "agricultura-agronegocio",
    influenciadores: "influenciadores-criadores",
    "influenciadores-criadores": "influenciadores-criadores",
    transportes: "transportes-logistica",
    "transportes-logistica": "transportes-logistica",
    servicos: "servicos-profissionais",
    "servicos-profissionais": "servicos-profissionais",
    "servicos-prof": "servicos-profissionais",
    banco: "bancos",
    bancos: "bancos",
    seguro: "seguradoras",
    seguros: "seguradoras",
    seguradora: "seguradoras",
    seguradoras: "seguradoras",
  };
  return map[slug.toLowerCase()] ?? null;
}

function Router() {
  const [selectedStore, setSelectedStore] = useState<StoreType>(
    () => (localStorage.getItem("eliora-selected-store") as StoreType) ?? inferStoreFromUrl()
  );
  const [location, setLoc] = useLocation();
  const basePath = location.split("?")[0];

  // NOTA hooks: os useEffect/useRef abaixo correm EM TODAS as rotas, antes
  // de qualquer early-return. Antes, /login, /busca etc. retornavam aqui
  // (2 hooks) e "/" corria 6+ hooks — ao navegar entre elas o React lançava
  // "Rendered fewer hooks than expected", desmontava tudo e o ecrã ficava
  // BRANCO até ao refresh. Ordem de hooks tem de ser estável.

  useEffect(() => {
    // No Safari iOS, forçar 'manual' PARTE o restauro nativo (pré-paint) e o
    // gesto/botão de voltar — o browser deixa de guardar posições e cai
    // sempre no topo (bugs WebKit documentados; ex. Astro #16061, Next #20951,
    // TanStack #7815). Aí deixa-se 'auto' e o browser trata; a nossa memória
    // vira no-op para a mesma posição. Nos outros, 'manual' + restauro JS.
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosSafari =
      (/iphone|ipad|ipod/.test(ua) && /safari/.test(ua) && !/crios|fxios|edgios|opios/.test(ua)) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS finge ser Mac
    history.scrollRestoration = isIosSafari ? "auto" : "manual";
    if (!isIosSafari) window.scrollTo(0, 0);
  }, []);

  // Memória de rolagem: voltar de uma loja devolve onde parou em vez do topo.
  // Refresh (só o 1º carregamento) vai sempre ao topo. Guarda por vertical +
  // URL em sessionStorage — sobrevive aos reloads (os cards navegam com
  // window.location.href, que limpa memória JS).
  const firstRestore = useRef(true);
  useEffect(() => {
    const freshReload = firstRestore.current && navType() === "reload";
    firstRestore.current = false;
    if (freshReload) {
      window.scrollTo(0, 0);
      return;
    }
    let cancelled = false;
    let saved = 0;
    try {
      // Lê pela mesma chave da gravação (vertical + URL real).
      saved = parseInt(sessionStorage.getItem(scrollKey()) || "0", 10) || 0;
    } catch {
      /* sem storage */
    }
    const cancel = () => {
      cancelled = true;
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    const go = () => {
      if (!cancelled && saved > 0) window.scrollTo(0, saved);
    };
    const t1 = requestAnimationFrame(go);
    // Perseguição até assentar: com API fria a lista cresce durante segundos
    // e um scroll cedo "cola" a meio (ficava nos ~500). Tenta até chegar.
    // Se a altura ainda está a crescer (dados a chegar, ex: refresh com Neon
    // a acordar), o contador rearma — teto duro de ~18s. Se o utilizador já
    // mexeu, não puxa de volta (cancel acima).
    let tries = 0;
    let steady = 0;
    let lastHeight = 0;
    try {
      lastHeight = document.body.scrollHeight;
    } catch {
      /* sem DOM */
    }
    const iv = setInterval(() => {
      tries++;
      if (cancelled || tries >= 30) {
        clearInterval(iv);
        return;
      }
      let h = lastHeight;
      try {
        h = document.body.scrollHeight;
      } catch {
        /* sem DOM */
      }
      if (h > lastHeight + 4) {
        // Conteúdo ainda a chegar (refresh com API fria): rearma e continua.
        lastHeight = h;
        steady = 0;
      }
      if (saved > 0 && Math.abs(window.scrollY - saved) > 8) {
        window.scrollTo(0, saved);
        steady = 0;
      } else {
        steady++;
        if (steady >= 2) clearInterval(iv); // estável: chegou (ou sem altura)
      }
    }, 600);
    return () => {
      cancel();
      cancelAnimationFrame(t1);
      clearInterval(iv);
    };
  }, [location, selectedStore]);

  // Grava a posição continuamente, ao clicar (síncrono, antes de navegar) e
  // ao sair da página. O clique em captura elimina qualquer corrida com o
  // throttle do scroll.
  useEffect(() => {
    let raf = 0;
    const save = () => {
      try {
        sessionStorage.setItem(scrollKey(), String(window.scrollY));
      } catch {
        /* sem storage */
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(save);
    };
    const onClick = () => save();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  // Deep-link: se abriu /loja/:id?from=colecao sem loja escolhida,
  // assume essa vertical para a loja abrir e o voltar funcionar em 2 níveis.
  useEffect(() => {
    if (!selectedStore) {
      const inferred = inferStoreFromUrl();
      if (inferred && window.location.pathname.startsWith("/loja")) {
        localStorage.setItem("eliora-selected-store", inferred);
        setSelectedStore(inferred);
      }
    }
  }, [selectedStore]);
  // Deep-link entre verticais: /login-beleza, /dashboard-casa,
  // /explorar-turismo ou /beleza ativam a vertical certa em vez de
  // cair na home errada (links partilhados, favoritos, voltar do login).
  useEffect(() => {
    const path = location.split("?")[0].toLowerCase();
    const m = path.match(/^\/(login|dashboard|explorar)-([a-z-]+)$/) || path.match(/^\/([a-z-]+)$/);
    const slug = m ? (m[2] ?? m[1]) : null;
    const v = slug ? slugToVertical(slug) : null;
    if (v && v !== selectedStore) {
      localStorage.setItem("eliora-selected-store", v);
      setSelectedStore(v);
    }
  }, [location, selectedStore]);
  // Rotas globais: funcionam em qualquer vertical (ver nota hooks acima —
  // este bloco vive DEPOIS de todos os hooks de propósito).
  if (basePath === "/login") return <Login />;
  if (basePath === "/busca") return <SearchPage />;
  if (basePath === "/dashboard") return <Dashboard />;
  if (basePath === "/carrinhos") return <VerCarrinhos />;
  if (basePath === "/descobrir-estilo") return <DescobrirEstilo />;
  if (basePath === "/consultores-estilo") return <ConsultoresEstilo />;
  if (basePath === "/privacidade") return <Privacidade />;
  if (basePath === "/sobre") return <Sobre />;
  if (basePath === "/contacto") return <Contacto />;
  const isDashboard = location.startsWith("/dashboard") || location.startsWith("/login") || location === "/selector";

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem("eliora-selected-store", storeId);
    setSelectedStore(storeId as StoreType);
    // reload() em vez de href="/": todos os chamadores já estão em "/",
    // e href empilhava um "/" duplicado no histórico (o voltar do navegador
    // tropeçava nele). reload não cria entrada nova.
    window.location.reload();
  };

  const handleBackToSelector = () => {
    // Limpa a seleção E sai do URL da vertical: sem navegar para "/",
    // o efeito deep-link voltava a inferir a vertical do URL e a home
    // reaparecia (parecia um simples refresh).
    localStorage.removeItem("eliora-selected-store");
    // Trocar de loja limpa as memórias das verticais, MAS preserva a do
    // seletor ("scroll:none:/") para ele próprio voltar onde parou.
    try {
      const dead: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith("scroll:") && k !== "scroll:none:/") dead.push(k);
      }
      dead.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* sem storage */
    }
    setSelectedStore(null);
    setLoc("/");
    window.scrollTo(0, 0);
  };

  if (!selectedStore) {
    if (location === "/proposito") {
      return <Proposito />;
    }
    if (location === "/lugares") {
      return <LugaresHome />;
    }
    if (location === "/explorar-lugares") {
      return <ExploreLugares />;
    }
    if (location === "/login-lugares") {
      return <LoginLugares />;
    }
    if (location === "/admin-lugares") {
      return <AdminLugares />;
    }
    return <StoreSelector onSelect={handleStoreSelect} />;
  }

  if (location === "/lugares") {
    return <LugaresHome />;
  }
  if (location === "/explorar-lugares") {
    return <ExploreLugares />;
  }
  if (location === "/login-lugares") {
    return <LoginLugares />;
  }
  if (location === "/admin-lugares") {
    return <AdminLugares />;
  }

  if (selectedStore === "weddings") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar" component={ExploreServices} />
          <Route path="/explorar-weddings" component={ExploreWeddings} />
          <Route path="/love-services">
            <MimoHome onBackToSelector={handleBackToSelector} />
          </Route>
          <Route path="/login-weddings" component={LoginWeddings} />
          <Route path="/dashboard-weddings" component={DashboardWeddings} />
          <Route>
            <ElioraWeddings onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "love-services") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-love" component={ExploreLove} />
          <Route path="/login-love" component={LoginLove} />
          <Route path="/dashboard-love" component={DashboardLove} />
          <Route>
            <MimoHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "business") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-business" component={ExploreBusiness} />
          <Route path="/login-business" component={LoginBusiness} />
          <Route path="/dashboard-business" component={DashboardBusiness} />
          <Route>
            <BusinessHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "formacoes") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/login-formacoes" component={LoginFormacoes} />
          <Route path="/dashboard-formacoes" component={DashboardFormacoes} />
          <Route path="/explorar-formacoes" component={ExploreFormacoes} />
          <Route>
            <FormacoesHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "eventos") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-eventos" component={ExploreEventos} />
          <Route path="/login-eventos" component={LoginEventos} />
          <Route path="/dashboard-eventos" component={DashboardEventos} />
          <Route>
            <EventosHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "entretenimento") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-entretenimento" component={ExploreEntretenimento} />
          <Route path="/login-entretenimento" component={LoginEntretenimento} />
          <Route path="/dashboard-entretenimento" component={DashboardEntretenimento} />
          <Route>
            <EntretenimentoHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "imoveis") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-imoveis" component={ExploreImoveis} />
          <Route path="/login-imoveis" component={LoginImoveis} />
          <Route path="/dashboard-imoveis" component={DashboardImoveis} />
          <Route>
            <ImoveisHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "infantil") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-infantil" component={ExploreInfantil} />
          <Route path="/login-infantil" component={LoginInfantil} />
          <Route path="/dashboard-infantil" component={DashboardInfantil} />
          <Route>
            <InfantilHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "automoveis") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-automoveis" component={ExploreAutomoveis} />
          <Route path="/login-automoveis" component={LoginAutomoveis} />
          <Route path="/dashboard-automoveis" component={DashboardAutomoveis} />
          <Route>
            <AutomoveisHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "saude") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-saude" component={ExploreSaude} />
          <Route path="/login-saude" component={LoginSaude} />
          <Route path="/dashboard-saude" component={DashboardSaude} />
          <Route>
            <SaudeHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "beleza") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-beleza" component={ExploreBeleza} />
          <Route path="/login-beleza" component={LoginBeleza} />
          <Route path="/dashboard-beleza" component={DashboardBeleza} />
          <Route>
            <BelezaHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "casa") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-casa" component={ExploreCasa} />
          <Route path="/login-casa" component={LoginCasa} />
          <Route path="/dashboard-casa" component={DashboardCasa} />
          <Route>
            <CasaHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "tecnologia-electronicos") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-tecnologia" component={ExploreTecnologia} />
          <Route path="/login-tecnologia" component={LoginTecnologia} />
          <Route path="/dashboard-tecnologia" component={DashboardTecnologia} />
          <Route>
            <TecnologiaHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "alimentacao-restauracao") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-alimentacao" component={ExploreAlimentacao} />
          <Route path="/login-alimentacao" component={LoginAlimentacao} />
          <Route path="/dashboard-alimentacao" component={DashboardAlimentacao} />
          <Route>
            <AlimentacaoHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "turismo-lazer") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-turismo" component={ExploreTurismo} />
          <Route path="/login-turismo" component={LoginTurismo} />
          <Route path="/dashboard-turismo" component={DashboardTurismo} />
          <Route>
            <TurismoHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "desporto-fitness") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-desporto" component={ExploreDesporto} />
          <Route path="/login-desporto" component={LoginDesporto} />
          <Route path="/dashboard-desporto" component={DashboardDesporto} />
          <Route>
            <DesportoHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "empregos-oportunidades") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-empregos" component={ExploreEmpregos} />
          <Route path="/login-empregos" component={LoginEmpregos} />
          <Route path="/dashboard-empregos" component={DashboardEmpregos} />
          <Route>
            <EmpregosHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "agricultura-agronegocio") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-agricultura" component={ExploreAgricultura} />
          <Route path="/login-agricultura" component={LoginAgricultura} />
          <Route path="/dashboard-agricultura" component={DashboardAgricultura} />
          <Route>
            <AgriculturaHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "influenciadores-criadores") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-influenciadores" component={ExploreInfluenciadores} />
          <Route path="/login-influenciadores" component={LoginInfluenciadores} />
          <Route path="/dashboard-influenciadores" component={DashboardInfluenciadores} />
          <Route>
            <InfluenciadoresHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "transportes-logistica") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-transportes" component={ExploreTransportes} />
          <Route path="/login-transportes" component={LoginTransportes} />
          <Route path="/dashboard-transportes" component={DashboardTransportes} />
          <Route>
            <TransportesHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "servicos-profissionais") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-servicos-prof" component={ExploreServicosProfissionais} />
          <Route path="/login-servicos-prof" component={LoginServicosProf} />
          <Route path="/dashboard-servicos" component={DashboardServicosProf} />
          <Route>
            <ServicosProfHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "bancos") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-bancos" component={ExploreBancos} />
          <Route path="/login-bancos" component={LoginBancos} />
          <Route path="/dashboard-bancos" component={DashboardBancos} />
          <Route>
            <BancosHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  if (selectedStore === "seguradoras") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar-seguradoras" component={ExploreSeguradoras} />
          <Route path="/login-seguradoras" component={LoginSeguradoras} />
          <Route path="/dashboard-seguradoras" component={DashboardSeguradoras} />
          <Route>
            <SeguradorasHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>

      </StoreContext.Provider>
    );
  }

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
      <ScrollToTop />
      <Switch>
        <Route path="/busca" component={SearchPage} />
        <Route path="/loja/:id" component={StoreProfile} />
        <Route path="/explorar" component={ExploreCollection} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/descobrir-estilo" component={DescobrirEstilo} />
        <Route path="/consultores-estilo" component={ConsultoresEstilo} />
        <Route path="/carrinhos" component={VerCarrinhos} />
        <Route path="/proposito" component={Proposito} />
        <Route path="/"><Home onBackToSelector={handleBackToSelector} /></Route>
        <Route component={NotFound} />
      </Switch>
    </StoreContext.Provider>
  );
}

function App() {
  useEffect(() => {
    initPush();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <OfflineBanner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
