import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState, createContext, useContext } from "react";
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
import LoginWeddings from "@/pages/LoginWeddings";
import DashboardWeddings from "@/pages/DashboardWeddings";
import StoreSelector from "@/pages/StoreSelector";
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
import NotFound from "@/pages/not-found";
import ExploreCollection from "@/pages/ExploreCollection";
import Proposito from "@/pages/Proposito";

const queryClient = new QueryClient();

type StoreType = "weddings" | "love-services" | "collection" | "business" | "formacoes" | "eventos" | "imoveis" | "infantil" | "automoveis" | "saude" | "beleza" | "casa" | "tecnologia-electronicos" | "alimentacao-restauracao" | "turismo-lazer" | "desporto-fitness" | "empregos-oportunidades" | "agricultura-agronegocio" | "influenciadores-criadores" | "transportes-logistica" | "servicos-profissionais" | null;

interface StoreContextType {
  selectedStore: StoreType;
  setSelectedStore: (store: StoreType) => void;
}

export const StoreContext = createContext<StoreContextType>({
  selectedStore: null,
  setSelectedStore: () => {},
});

export function useStore() {
  return useContext(StoreContext);
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const [selectedStore, setSelectedStore] = useState<StoreType>(
    () => localStorage.getItem("eliora-selected-store") as StoreType
  );
  const [location] = useLocation();

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  const isDashboard = location.startsWith("/dashboard") || location.startsWith("/login") || location === "/selector";

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem("eliora-selected-store", storeId);
    window.location.href = "/";
  };

  const handleBackToSelector = () => {
    localStorage.removeItem("eliora-selected-store");
    setSelectedStore(null);
    window.scrollTo(0, 0);
  };

  if (!selectedStore) {
    if (location === "/proposito") {
      return <Proposito />;
    }
    return <StoreSelector onSelect={handleStoreSelect} />;
  }

  if (selectedStore === "weddings") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route path="/explorar" component={ExploreServices} />
          <Route path="/love-services" component={MimoHome} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
