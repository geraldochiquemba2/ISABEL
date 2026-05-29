import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Store, Package, Star, Eye,
  MessageCircle, TrendingUp, Edit2, Trash2, Plus,
  ChevronRight,
} from "lucide-react";
import { STORES, REVIEWS } from "@/data/mock";
import { StarRating } from "@/components/StarRating";
import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const myStore = STORES[0];
const myReviews = REVIEWS.filter((r) => r.storeId === myStore.id);

type Section = "overview" | "loja" | "produtos" | "avaliacoes";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Visao Geral", icon: <LayoutDashboard size={16} /> },
  { id: "loja", label: "Minha Loja", icon: <Store size={16} /> },
  { id: "produtos", label: "Produtos", icon: <Package size={16} /> },
  { id: "avaliacoes", label: "Avaliacoes", icon: <Star size={16} /> },
];

export default function Dashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-sidebar border-r border-sidebar-border p-4 flex-shrink-0">
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3">
              Painel do Lojista
            </p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  section === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                section === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
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

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Visao Geral</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Resumo do desempenho da sua loja</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Eye size={18} />} label="Visualizacoes" value="1.240" sub="ultimos 30 dias" />
        <StatCard icon={<MessageCircle size={18} />} label="Contatos WhatsApp" value="87" sub="ultimos 30 dias" />
        <StatCard icon={<Package size={18} />} label="Produtos" value={myStore.products.length} />
        <StatCard icon={<TrendingUp size={18} />} label="Avaliacao Media" value={myStore.rating.toFixed(1)} sub={`${myStore.reviewCount} avaliacoes`} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Ultimas avaliacoes</h2>
        <div className="space-y-3">
          {REVIEWS.slice(0, 3).map((review) => (
            <div key={review.id} className="bg-card border border-card-border rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {review.author.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">{review.author}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{review.text}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{review.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LojaSection() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Minha Loja</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Edite as informacoes publicas da sua loja</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Nome da loja</label>
          <Input data-testid="input-store-name" defaultValue={myStore.name} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Categoria</label>
          <Select defaultValue={myStore.category}>
            <SelectTrigger data-testid="select-store-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Moda","Eletronicos","Alimentacao","Saude & Beleza","Servicos Residenciais","Automotivo","Educacao","Pets"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Descricao</label>
          <Textarea
            data-testid="input-store-description"
            defaultValue={myStore.description}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Telefone</label>
          <Input data-testid="input-store-phone" defaultValue={myStore.phone} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Endereco</label>
          <Input data-testid="input-store-address" defaultValue={myStore.address} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { day: "Seg-Sex", time: "08:00 - 18:00" },
            { day: "Sabado", time: "09:00 - 14:00" },
            { day: "Domingo", time: "Fechado" },
          ].map((h) => (
            <div key={h.day}>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{h.day}</label>
              <Input data-testid={`input-hours-${h.day}`} defaultValue={h.time} className="text-xs" />
            </div>
          ))}
        </div>
        {saved ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-emerald-700 text-sm font-medium">
            Alteracoes salvas com sucesso!
          </div>
        ) : (
          <Button
            data-testid="button-save-store"
            className="w-full"
            onClick={() => setSaved(true)}
          >
            Salvar alteracoes
          </Button>
        )}
      </div>
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
    setProducts((prev) => [
      ...prev,
      {
        id: `p-new-${Date.now()}`,
        name: newName,
        price: parseFloat(newPrice) || 0,
        imageColor: "#e5e7eb",
      },
    ]);
    setNewName("");
    setNewPrice("");
    setAdding(false);
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Produtos / Servicos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} itens cadastrados</p>
        </div>
        <Button
          data-testid="button-add-product"
          size="sm"
          onClick={() => setAdding(true)}
          className="gap-1.5"
        >
          <Plus size={14} />
          Adicionar
        </Button>
      </div>

      {adding && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-primary/30 rounded-xl p-4 space-y-3"
        >
          <p className="text-sm font-semibold text-foreground">Novo produto / servico</p>
          <div className="flex gap-3">
            <Input
              data-testid="input-new-product-name"
              placeholder="Nome do produto"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              data-testid="input-new-product-price"
              placeholder="Preco (R$)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-28"
              type="number"
            />
          </div>
          <div className="flex gap-2">
            <Button data-testid="button-confirm-add" size="sm" onClick={addProduct}>Adicionar</Button>
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </motion.div>
      )}

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Produto</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Preco</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: product.imageColor }}
                    />
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {product.price > 0
                    ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                    : <Badge variant="outline" className="text-emerald-600 border-emerald-200">Gratuito</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      data-testid={`button-edit-product-${product.id}`}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      data-testid={`button-delete-product-${product.id}`}
                      onClick={() => removeProduct(product.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AvaliacoesSection({ reviews }: { reviews: typeof REVIEWS }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Avaliacoes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{reviews.length} avaliacoes recebidas</p>
      </div>
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Voce ainda nao tem avaliacoes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              data-testid={`card-dashboard-review-${review.id}`}
              className="bg-card border border-card-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground mt-3 ml-12">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
