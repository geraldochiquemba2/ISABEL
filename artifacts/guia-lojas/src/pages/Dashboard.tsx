import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Store, Package, Star,
  Eye, MessageCircle, TrendingUp, Edit2, Trash2, Plus,
} from "lucide-react";
import { STORES, REVIEWS } from "@/data/mock";
import { StarRating } from "@/components/StarRating";
import { PageTransition } from "@/components/PageTransition";

const myStore = STORES[0];
const myReviews = REVIEWS.filter((r) => r.storeId === myStore.id);

type Section = "overview" | "loja" | "produtos" | "avaliacoes";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard size={15} /> },
  { id: "loja", label: "Minha Loja", icon: <Store size={15} /> },
  { id: "produtos", label: "Produtos", icon: <Package size={15} /> },
  { id: "avaliacoes", label: "Avaliações", icon: <Star size={15} /> },
];

export default function Dashboard() {
  const [section, setSection] = useState<Section>("overview");

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 bg-muted border-r border-border p-5 flex-shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-2">Painel</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                  section === item.id
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-border"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                section === item.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 pb-20 md:pb-8 overflow-auto bg-white">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {section === "overview" && <OverviewSection />}
            {section === "loja" && <LojaSection />}
            {section === "produtos" && <ProdutosSection />}
            {section === "avaliacoes" && <AvaliacoesSection reviews={myReviews} />}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-7 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Últimos 30 dias</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={<Eye size={14} />} label="Visualizações" value="1.240" sub="este mês" />
        <Stat icon={<MessageCircle size={14} />} label="Contatos WhatsApp" value="87" sub="este mês" />
        <Stat icon={<Package size={14} />} label="Produtos" value={myStore.products.length} />
        <Stat icon={<TrendingUp size={14} />} label="Avaliação" value={myStore.rating.toFixed(1)} sub={`${myStore.reviewCount} avaliações`} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Avaliações recentes</p>
        <div className="space-y-3">
          {REVIEWS.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-semibold text-foreground">
                {r.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-medium text-foreground">{r.author}</span><StarRating rating={r.rating} /></div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.text}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CleanField({ label, defaultValue, testId, as: As = "input" }: {
  label: string; defaultValue: string; testId: string; as?: "input" | "textarea";
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">{label}</label>
      {As === "textarea" ? (
        <textarea data-testid={testId} defaultValue={defaultValue} rows={3}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors resize-none" />
      ) : (
        <input data-testid={testId} defaultValue={defaultValue}
          className="w-full border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-foreground transition-colors" />
      )}
    </div>
  );
}

function LojaSection() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">Minha Loja</h1>
      <CleanField label="Nome da loja" defaultValue={myStore.name} testId="input-store-name" />
      <CleanField label="Descrição" defaultValue={myStore.description} testId="input-store-description" as="textarea" />
      <CleanField label="Telefone" defaultValue={myStore.phone} testId="input-store-phone" />
      <CleanField label="Endereço" defaultValue={myStore.address} testId="input-store-address" />
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Horários</label>
        <div className="grid grid-cols-3 gap-3">
          {[{ day: "Seg-Sex", time: "08:00 - 18:00" }, { day: "Sábado", time: "09:00 - 14:00" }, { day: "Domingo", time: "Fechado" }].map((h) => (
            <div key={h.day}>
              <p className="text-xs text-muted-foreground mb-1">{h.day}</p>
              <input data-testid={`input-hours-${h.day}`} defaultValue={h.time}
                className="w-full border-b border-border bg-transparent py-1.5 text-xs text-foreground outline-none focus:border-foreground transition-colors" />
            </div>
          ))}
        </div>
      </div>
      {saved ? (
        <p className="text-sm text-emerald-600 font-medium">Salvo com sucesso.</p>
      ) : (
        <button data-testid="button-save-store" onClick={() => setSaved(true)}
          className="bg-foreground text-background text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity">
          Salvar alterações
        </button>
      )}
    </div>
  );
}

function ProdutosSection() {
  const [products, setProducts] = useState(myStore.products);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  function addProduct() {
    if (!newName.trim()) return;
    setProducts((prev) => [...prev, { id: `p-${Date.now()}`, name: newName, price: parseFloat(newPrice) || 0, imageColor: "#f0f0f0" }]);
    setNewName(""); setNewPrice(""); setAdding(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Produtos</h1>
        <button data-testid="button-add-product" onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-foreground rounded-full px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors">
          <Plus size={13} /> Adicionar
        </button>
      </div>

      {adding && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-2xl p-5 space-y-4">
          <p className="text-sm font-medium text-foreground">Novo produto</p>
          <div className="flex gap-3">
            <input data-testid="input-new-product-name" placeholder="Nome" value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground" />
            <input data-testid="input-new-product-price" placeholder="R$" value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)} type="number"
              className="w-24 border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-3">
            <button data-testid="button-confirm-add" onClick={addProduct}
              className="text-sm font-medium text-background bg-foreground px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity">Confirmar</button>
            <button onClick={() => setAdding(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
          </div>
        </motion.div>
      )}

      <div className="divide-y divide-border">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-3.5">
            <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: p.imageColor }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.price > 0 ? `R$ ${p.price.toFixed(2).replace(".", ",")}` : "Gratuito"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button data-testid={`button-edit-product-${p.id}`} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
              <button data-testid={`button-delete-product-${p.id}`} onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvaliacoesSection({ reviews }: { reviews: typeof REVIEWS }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">Avaliações</h1>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10">Nenhuma avaliação ainda.</p>
      ) : (
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div key={review.id} data-testid={`card-dashboard-review-${review.id}`} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground mt-3 ml-11 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
