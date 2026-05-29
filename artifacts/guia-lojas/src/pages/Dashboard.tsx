import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Store, Package,
  Eye, MessageCircle, TrendingUp, Edit2, Trash2, Plus,
  ChevronRight, Tag,
} from "lucide-react";
import { STORES, Product } from "@/data/mock";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import { PageTransition } from "@/components/PageTransition";

const myStore = STORES[0];

type Section = "overview" | "loja" | "produtos";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Visão Geral", icon: <LayoutDashboard size={15} /> },
  { id: "loja", label: "Minha Loja", icon: <Store size={15} /> },
  { id: "produtos", label: "Produtos", icon: <Package size={15} /> },
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
        <Stat icon={<TrendingUp size={14} />} label="Cliques no WhatsApp" value="312" sub="este mês" />
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

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

interface DaySchedule {
  label: string;
  closed: boolean;
  open: string;
  close: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { label: "Segunda a Sexta", closed: false, open: "08:00", close: "18:00" },
  { label: "Sábado",          closed: false, open: "09:00", close: "14:00" },
  { label: "Domingo",         closed: true,  open: "08:00", close: "18:00" },
];

function TimeSelect({
  value, onChange, disabled, testId,
}: { value: string; onChange: (v: string) => void; disabled?: boolean; testId?: string }) {
  return (
    <div className="relative">
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none border border-border rounded-xl px-3 py-2 text-xs text-foreground bg-white outline-none focus:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed pr-7 cursor-pointer"
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
        <ChevronRight size={12} className="rotate-90" />
      </span>
    </div>
  );
}

function LojaSection() {
  const [saved, setSaved] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);

  function updateDay(i: number, patch: Partial<DaySchedule>) {
    setSchedule((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
    setSaved(false);
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">Minha Loja</h1>
      <CleanField label="Nome da loja" defaultValue={myStore.name} testId="input-store-name" />
      <CleanField label="Descrição" defaultValue={myStore.description} testId="input-store-description" as="textarea" />
      <CleanField label="Telefone" defaultValue={myStore.phone} testId="input-store-phone" />
      <CleanField label="Endereço" defaultValue={myStore.address} testId="input-store-address" />

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-4">
          Horários de funcionamento
        </label>
        <div className="space-y-3">
          {schedule.map((day, i) => (
            <div key={day.label} className="border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">{day.label}</p>
                {/* Fechado toggle */}
                <button
                  type="button"
                  data-testid={`toggle-closed-${i}`}
                  onClick={() => updateDay(i, { closed: !day.closed })}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer focus:outline-none ${
                    day.closed ? "bg-foreground" : "bg-border"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                      day.closed ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {day.closed ? (
                <p className="text-xs text-muted-foreground bg-muted rounded-xl px-3 py-2 text-center">
                  Fechado
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Abertura</p>
                    <TimeSelect
                      testId={`select-open-${i}`}
                      value={day.open}
                      onChange={(v) => updateDay(i, { open: v })}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">Fechamento</p>
                    <TimeSelect
                      testId={`select-close-${i}`}
                      value={day.close}
                      onChange={(v) => updateDay(i, { close: v })}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {saved ? (
        <p className="text-sm text-emerald-600 font-medium">Salvo com sucesso.</p>
      ) : (
        <button
          data-testid="button-save-store"
          onClick={() => setSaved(true)}
          className="bg-foreground text-background text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity"
        >
          Salvar alterações
        </button>
      )}
    </div>
  );
}

function ProdutosSection() {
  const [products, setProducts] = useState<Product[]>(myStore.products);
  const [adding, setAdding] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newSubcategoryId, setNewSubcategoryId] = useState("");

  const selectedCategory = PRODUCT_CATEGORIES.find((c) => c.id === newCategoryId);

  function resetForm() {
    setNewName("");
    setNewPrice("");
    setNewCategoryId("");
    setNewSubcategoryId("");
    setAdding(false);
  }

  function addProduct() {
    if (!newName.trim()) return;
    const cat = PRODUCT_CATEGORIES.find((c) => c.id === newCategoryId);
    const sub = cat?.subcategories.find((s) => s.id === newSubcategoryId);
    setProducts((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        name: newName,
        price: parseFloat(newPrice) || 0,
        imageColor: "#f0f0f0",
        category: cat?.name,
        subcategory: sub?.name,
      },
    ]);
    resetForm();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.length} itens cadastrados</p>
        </div>
        {!adding && (
          <button
            data-testid="button-add-product"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-foreground rounded-full px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <Plus size={13} /> Adicionar
          </button>
        )}
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-border rounded-2xl p-6 space-y-5 bg-muted/30"
          >
            <p className="text-sm font-semibold text-foreground">Novo produto / serviço</p>

            {/* Name + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Nome
                </label>
                <input
                  data-testid="input-new-product-name"
                  placeholder="Ex: Vestido Floral"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Preço (R$)
                </label>
                <input
                  data-testid="input-new-product-price"
                  placeholder="0,00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    data-testid={`button-cat-${cat.id}`}
                    type="button"
                    onClick={() => {
                      setNewCategoryId(cat.id === newCategoryId ? "" : cat.id);
                      setNewSubcategoryId("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      newCategoryId === cat.id
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory — appears after category is selected */}
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2 flex items-center gap-1.5">
                      <ChevronRight size={11} />
                      Subcategoria em <span className="text-foreground">{selectedCategory.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          data-testid={`button-subcat-${sub.id}`}
                          type="button"
                          onClick={() => setNewSubcategoryId(sub.id === newSubcategoryId ? "" : sub.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            newSubcategoryId === sub.id
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary preview */}
            {(newCategoryId || newSubcategoryId) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-muted px-3 py-2 rounded-xl"
              >
                <Tag size={13} className="text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Classificado como:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedCategory?.name}
                    {newSubcategoryId && ` › ${selectedCategory?.subcategories.find((s) => s.id === newSubcategoryId)?.name}`}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                data-testid="button-confirm-add"
                onClick={addProduct}
                disabled={!newName.trim()}
                className="text-sm font-medium text-background bg-foreground px-5 py-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Adicionar produto
              </button>
              <button
                onClick={resetForm}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product list */}
      <div className="divide-y divide-border">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} onDelete={(id) => setProducts((prev) => prev.filter((x) => x.id !== id))} />
        ))}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
}

function ProductRow({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center gap-4 py-3.5" data-testid={`row-product-${product.id}`}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name}
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: product.imageColor }} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <p className="text-xs text-muted-foreground">
            {product.price > 0 ? `R$ ${product.price.toFixed(2).replace(".", ",")}` : "Gratuito"}
          </p>
          {/* Category + subcategory badges */}
          {product.category && (
            <>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                <Tag size={9} />
                {product.category}
              </span>
            </>
          )}
          {product.subcategory && (
            <>
              <ChevronRight size={10} className="text-muted-foreground" />
              <span className="inline-flex items-center text-[11px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                {product.subcategory}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          data-testid={`button-edit-product-${product.id}`}
          onClick={() => setEditing(!editing)}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Edit2 size={13} />
        </button>
        <button
          data-testid={`button-delete-product-${product.id}`}
          onClick={() => onDelete(product.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

