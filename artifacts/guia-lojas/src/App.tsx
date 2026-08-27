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
import NotFound from "@/pages/not-found";
import ExploreCollection from "@/pages/ExploreCollection";

const queryClient = new QueryClient();

type StoreType = "weddings" | "love-services" | "collection" | "business" | "formacoes" | "eventos" | "imoveis" | "infantil" | null;

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
        <Route path="/carrinhos" component={VerCarrinhos} />
        <Route path="/"><Home onBackToSelector={handleBackToSelector} /></Route>
        <Route component={NotFound} />
      </Switch>
      {floatingButton}
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
