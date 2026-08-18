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
import { MimoHome } from "@/pages/MimoHome";
import LoginLove from "@/pages/LoginLove";
import DashboardLove from "@/pages/DashboardLove";
import ExploreLove from "@/pages/ExploreLove";
import BusinessHome from "@/pages/BusinessHome";
import { FormacoesHome } from "@/pages/FormacoesHome";
import { EventosHome } from "@/pages/EventosHome";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

type StoreType = "weddings" | "love-services" | "collection" | "business" | "formacoes" | "eventos" | null;

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
    setSelectedStore(storeId as StoreType);
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };

  const handleBackToSelector = () => {
    localStorage.removeItem("eliora-selected-store");
    setSelectedStore(null);
    window.scrollTo(0, 0);
  };

  if (!selectedStore) {
    return <StoreSelector onSelect={handleStoreSelect} />;
  }

  const floatingButton = !isDashboard ? (
    <button
      onClick={() => { handleBackToSelector(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#2c3035] text-white text-sm font-medium rounded-full shadow-lg hover:bg-[#1a1d20] hover:scale-105"
      style={{ transform: "translateZ(0)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Trocar loja
    </button>
  ) : null;

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
        {floatingButton}
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
        {floatingButton}
      </StoreContext.Provider>
    );
  }

  if (selectedStore === "business") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route>
            <BusinessHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>
        {floatingButton}
      </StoreContext.Provider>
    );
  }

  if (selectedStore === "formacoes") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route>
            <FormacoesHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>
        {floatingButton}
      </StoreContext.Provider>
    );
  }

  if (selectedStore === "eventos") {
    return (
      <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
        <ScrollToTop />
        <Switch>
          <Route path="/loja/:id" component={StoreProfile} />
          <Route>
            <EventosHome onBackToSelector={handleBackToSelector} />
          </Route>
        </Switch>
        {floatingButton}
      </StoreContext.Provider>
    );
  }

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore: handleStoreSelect }}>
      <Navbar onBackToSelector={handleBackToSelector} />
      <ScrollToTop />
      <Switch>
        <Route path="/"><Home onBackToSelector={handleBackToSelector} /></Route>
        <Route path="/busca" component={SearchPage} />
        <Route path="/loja/:id" component={StoreProfile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/descobrir-estilo" component={DescobrirEstilo} />
        <Route path="/carrinhos" component={VerCarrinhos} />
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
