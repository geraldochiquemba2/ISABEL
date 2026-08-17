import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Store, Package, MessageCircle, ShieldAlert, KeyRound,
  Plus, Edit2, Trash2, X, Menu, Camera, LogOut, Upload, RefreshCw,
} from "lucide-react";
import {
  fetchStoreById, updateStore, createProduct, deleteProduct, updateProduct,
  changePassword, uploadImage, fetchAdminUsersFiltered, resetUserPassword,
} from "@/lib/api";
import { LoveAdminPanel } from "@/components/LoveAdminPanel";

interface DaySchedule {
  label: string;
  closed: boolean;
  open: string;
  close: string;
}

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { label: "Segunda a Sexta", closed: false, open: "08:00", close: "18:00" },
  { label: "Sábado", closed: false, open: "09:00", close: "14:00" },
  { label: "Domingo", closed: true, open: "08:00", close: "18:00" },
];

function TimeSelect({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
      className={`${inputCls} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}>
      {TIME_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
    </select>
  );
}

const LOVE_SERVICE_GROUPS = [
  {
    number: "01",
    title: "Actos de Amor, Homenagens e Experiências",
    intro: "Faça-se presente nos dias que mais importam.",
    category: "actos-de-amor",
    items: ["Presentes e buquês", "Cartas escritas à mão", "Serenatas e músicos", "Festas íntimas"],
  },
  {
    number: "02",
    title: "Fotografia e Videomakers",
    intro: "Guarde o instante. Conte a história inteira.",
    category: "fotografia",
    items: ["Fotógrafos", "Videomakers"],
  },
  {
    number: "03",
    title: "Saúde, Cuidado e Bem-Estar ao Domicílio",
    intro: "Cuidado especializado, no conforto de casa.",
    category: "saude",
    items: ["Enfermagem e médicos", "Fisioterapia e massagens", "Apoio psicológico", "Personal trainers"],
  },
  {
    number: "04",
    title: "Gestão do Lar e Refeições",
    intro: "Mais tempo para si. Uma casa que respira.",
    category: "lar",
    items: ["Cozinheiras e meal prep", "Personal organizers", "Limpeza profunda", "Assistente de compras"],
  },
  {
    number: "05",
    title: "Burocracias",
    intro: "Nós tratamos do que não pode esperar.",
    category: "burocracias",
    items: ["Pendências diárias", "Filas", "Entregas urgentes"],
  },
];

type Section = "overview" | "loja" | "produtos" | "contactos" | "admin";

const labelCls = "block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";
const inputCls = "w-full border border-[#d1d4d8] bg-white py-2.5 px-4 text-sm text-[#30343a] placeholder:text-[#87909a] outline-none focus:border-[#d96f5c] focus:ring-2 focus:ring-[#d96f5c]/10 transition-all rounded-xl";

function LojaSection({ store, isDirty, setDirty, saveFnRef }: { store: any; isDirty: boolean; setDirty: (v: boolean) => void; saveFnRef: React.MutableRefObject<(() => Promise<void>) | null> }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: store.name || "",
    description: store.description || "",
    address: store.address || "",
    phone: store.phone || "",
    whatsapp: store.whatsapp || "",
    province: store.province || "",
    municipality: store.municipality || "",
    coverColor: store.coverColor || "#f8f1e7",
    coverImage: store.coverImage || "",
    logoUrl: store.logoUrl || "",
  });
  const [schedule, setSchedule] = useState<DaySchedule[]>(store.schedule || DEFAULT_SCHEDULE);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "coverImage" | "coverImages") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await uploadImage(base64, `${store.id}-${field}`);
        if (field === "coverImages") {
          const currentImages = store.coverImages || [];
          await updateStore(store.id, { ...store, coverImages: [...currentImages, res.imageUrl] });
        } else {
          await updateStore(store.id, { ...store, [field]: res.imageUrl });
          setForm((prev) => ({ ...prev, [field]: res.imageUrl }));
        }
        queryClient.invalidateQueries({ queryKey: ["myStore"] });
        setUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(null);
    }
  };

  const handleRemoveCoverImage = async (index: number) => {
    const currentImages = store.coverImages || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    await updateStore(store.id, { ...store, coverImages: newImages });
    queryClient.invalidateQueries({ queryKey: ["myStore"] });
  };

  const save = async () => {
    await updateStore(store.id, {
      ...form,
      coverImages: store.coverImages || [],
      isOpen: store.isOpen,
      schedule,
    });
    queryClient.invalidateQueries({ queryKey: ["myStore"] });
    setDirty(false);
  };

  saveFnRef.current = save;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-[#30343a]">Minha Loja</h2>
        {isDirty && (
          <button onClick={save} className="flex items-center gap-2 bg-[#d96f5c] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#c5614f] transition-colors">
            <Upload size={14} /> Guardar alterações
          </button>
        )}
      </div>

      {/* Imagens */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 space-y-5 max-w-2xl">
        <h3 className="font-serif text-lg text-[#30343a]">Imagens</h3>

        <div>
          <label className={labelCls}>Foto de perfil (Logo)</label>
          <div className="flex items-center gap-4">
            {store.logoUrl && <img src={store.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-[#e8eaed]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#d96f5c] hover:text-[#d96f5c] cursor-pointer transition-colors">
              <Camera size={14} />
              {uploading === "logoUrl" ? "A enviar..." : store.logoUrl ? "Trocar logo" : "Adicionar logo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logoUrl")} disabled={uploading !== null} />
            </label>
          </div>
        </div>

        <div>
          <label className={labelCls}>Imagem de capa</label>
          <div className="flex items-center gap-4">
            {store.coverImage && <img src={store.coverImage} alt="Capa" className="w-32 h-20 rounded-xl object-cover border border-[#e8eaed]" />}
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#d1d4d8] rounded-xl text-xs text-[#87909a] hover:border-[#d96f5c] hover:text-[#d96f5c] cursor-pointer transition-colors">
              <Camera size={14} />
              {uploading === "coverImage" ? "A enviar..." : store.coverImage ? "Trocar capa" : "Adicionar capa"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImage")} disabled={uploading !== null} />
            </label>
          </div>
        </div>

        <div>
          <label className={labelCls}>Galeria de imagens</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {(store.coverImages || []).map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Galeria ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-[#e8eaed]" />
                <button
                  onClick={() => handleRemoveCoverImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border border-dashed border-[#d1d4d8] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#87909a] hover:border-[#d96f5c] hover:text-[#d96f5c] cursor-pointer transition-colors">
              <Camera size={16} className="mb-1" />
              {uploading === "coverImages" ? "..." : "Adicionar"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImages")} disabled={uploading !== null} />
            </label>
          </div>
        </div>
      </div>

      {/* Dados */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-6 space-y-5 max-w-2xl">
        <h3 className="font-serif text-lg text-[#30343a]">Dados da loja</h3>
        <div><label className={labelCls}>Nome da loja</label><input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Descrição</label><textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Telefone</label><input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>WhatsApp</label><input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Endereço</label><input value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Província</label><input value={form.province} onChange={(e) => handleChange("province", e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Município</label><input value={form.municipality} onChange={(e) => handleChange("municipality", e.target.value)} className={inputCls} /></div>
        </div>

        <div>
          <label className={labelCls}>Horários de funcionamento</label>
          <div className="space-y-3">
            {schedule.map((day, i) => (
              <div key={day.label} className="border border-[#e8eaed] rounded-2xl p-4 bg-[#fafafa]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#30343a]">{day.label}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      day.closed ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}>
                      {day.closed ? "Fechado" : "Aberto"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, closed: !d.closed } : d)); setDirty(true); }}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer ${
                      !day.closed ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${!day.closed ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className={`grid grid-cols-2 gap-3 transition-all duration-200 ${day.closed ? "opacity-50 pointer-events-none" : ""}`}>
                  <div>
                    <p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Abertura</p>
                    <TimeSelect value={day.open} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, open: v } : d)); setDirty(true); }} disabled={day.closed} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#87909a] mb-1.5 font-medium uppercase tracking-wide">Fechamento</p>
                    <TimeSelect value={day.close} onChange={(v) => { setSchedule((prev) => prev.map((d, idx) => idx === i ? { ...d, close: v } : d)); setDirty(true); }} disabled={day.closed} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdutosSection({ store }: { store: any }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const createMut = useMutation({
    mutationFn: () => {
      if (editProduct) {
        return updateProduct(editProduct.id, {
          ...form,
          price: Number(form.price) || 0,
          imageUrl: productImages[0] || "",
          imageUrls: productImages,
        });
      }
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const selectedGroup = LOVE_SERVICE_GROUPS.find((g) => g.title === form.category);
      return createProduct({
        id,
        ...form,
        category: selectedGroup ? selectedGroup.title : form.category,
        price: Number(form.price) || 0,
        storeId: store.id,
        imageUrl: productImages[0] || "",
        imageUrls: productImages,
      });
    },
    onSuccess: () => { setShowForm(false); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); queryClient.invalidateQueries({ queryKey: ["myStore"] }); },
    onError: (error: Error) => { console.error("Erro ao guardar serviço:", error.message); alert("Erro ao guardar: " + error.message); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myStore"] }),
  });

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = 5 - productImages.length;
    if (remaining <= 0) { alert("Máximo de 5 imagens por serviço."); return; }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploadingImg(true);
    try {
      for (const file of toUpload) {
        const reader = new FileReader();
        const res = await new Promise<{ imageUrl: string }>((resolve, reject) => {
          reader.onload = async () => {
            try {
              const imgRes = await uploadImage(reader.result as string, `product-${Date.now()}-${Math.random().toString(36).slice(2)}`);
              resolve(imgRes);
            } catch (err) { reject(err); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setProductImages((prev) => [...prev, res.imageUrl]);
      }
    } catch (err) { alert("Erro ao enviar imagem."); }
    setUploadingImg(false);
  };

  const products = store.products || [];

  const getProductsForGroup = (category: string) => {
    return products.filter((p: any) => {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subcategory || "").toLowerCase();
      const group = LOVE_SERVICE_GROUPS.find((g) => g.category === category);
      if (!group) return cat.includes(category.toLowerCase());
      return cat.includes(group.title.toLowerCase()) || cat.includes(category.toLowerCase()) || sub.includes(category.toLowerCase());
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl text-[#30343a]">Serviços</h2>
        <button onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: "", price: "", currency: "AOA", category: "", subcategory: "", description: "" }); setProductImages([]); }} className="flex items-center gap-2 bg-[#d96f5c] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#c5614f] transition-colors">
          <Plus size={15} /> Novo serviço
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl border border-[#e8eaed] p-6 mb-8 max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-[#30343a]">{editProduct ? "Editar serviço" : "Novo serviço"}</h3>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="text-[#87909a] hover:text-[#30343a]"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Imagens do serviço (até 5)</label>
                <div className="flex flex-wrap gap-2">
                  {productImages.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#d1d4d8]">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setProductImages((prev) => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"><X size={10} /></button>
                    </div>
                  ))}
                  {productImages.length < 5 && (
                    <label className="w-20 h-20 border border-dashed border-[#d1d4d8] rounded-xl flex flex-col items-center justify-center text-[10px] text-[#87909a] hover:border-[#d96f5c] hover:text-[#d96f5c] cursor-pointer transition-colors">
                      <Camera size={16} className="mb-1" />
                      {uploadingImg ? "..." : "Adicionar"}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductImageUpload} disabled={uploadingImg} />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-[#87909a]">{productImages.length}/5 imagens</p>
              </div>

              <div><label className={labelCls}>Nome</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Ex: Fotógrafo" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className={labelCls}>Preço</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} /></div>
                <div>
                  <label className={labelCls}>Moeda</label>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls}>
                    <option value="AOA">AOA (Kz)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Categoria</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    <option value="">Selecionar...</option>
                    {LOVE_SERVICE_GROUPS.map((group) => (
                      <option key={group.category} value={group.title}>{group.number} — {group.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Subcategoria</label>
                <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className={inputCls} disabled={!form.category}>
                  <option value="">Selecionar...</option>
                  {LOVE_SERVICE_GROUPS.find((g) => g.title === form.category)?.items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div><label className={labelCls}>Descrição</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} /></div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending || !form.name} className="bg-[#d96f5c] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#c5614f] transition-colors disabled:opacity-50">
                {createMut.isPending ? "A guardar..." : editProduct ? "Atualizar" : "Guardar"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {LOVE_SERVICE_GROUPS.filter((group) => {
          const groupProducts = getProductsForGroup(group.category);
          return groupProducts.length > 0;
        }).map((group) => {
          const groupProducts = getProductsForGroup(group.category);
          const isExpanded = selectedGroup === group.category;
          return (
            <div key={group.category} className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
              <button
                onClick={() => setSelectedGroup(isExpanded ? null : group.category)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#30343a]">{group.title}</h4>
                    <p className="text-xs text-[#87909a] mt-0.5">{groupProducts.length} serviço(s)</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#87909a] transition-transform ${isExpanded ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {isExpanded && (
                <div className="border-t border-[#e8eaed] p-5">
                  <div className="space-y-2">
                    {groupProducts.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-xl">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div className="flex-1">
                          <h5 className="text-xs font-medium text-[#30343a]">{p.name}</h5>
                          <p className="text-[10px] text-[#87909a]">{p.subcategory || p.category} {p.price ? `· ${p.currency === "USD" ? "$" : "Kz"} ${p.price.toLocaleString("pt-AO")}` : ""}</p>
                        </div>
                        <button onClick={() => { setEditProduct(p); setForm({ name: p.name, price: String(p.price || ""), currency: p.currency || "AOA", category: p.category || "", subcategory: p.subcategory || "", description: p.description || "" }); setProductImages(p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : [])); setShowForm(true); }} className="text-[#87909a] hover:text-[#d96f5c] transition-colors p-1"><Edit2 size={13} /></button>
                        <button onClick={() => { if (confirm("Eliminar este serviço?")) deleteMut.mutate(p.id); }} className="text-[#87909a] hover:text-red-500 transition-colors p-1"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardLove() {
  const [, setLoc] = useLocation();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const saveFnRef = useRef<(() => Promise<void>) | null>(null);

  const localUserStr = typeof window !== "undefined" ? localStorage.getItem("guialocal_user") : null;
  const user = localUserStr ? JSON.parse(localUserStr) : null;
  const isAdmin = user?.phone === "999999999";

  const { data: store, isLoading } = useQuery({
    queryKey: ["myStore"],
    queryFn: () => fetchStoreById(user?.storeId),
    enabled: !!user?.storeId,
  });

  const handleLogout = () => {
    localStorage.removeItem("guialocal_user");
    setLoc("/love-services");
  };

  const sidebarItems = [
    ...(isAdmin ? [
      { id: "overview" as Section, label: "Redefinir Senhas", icon: <KeyRound size={15} /> },
      { id: "admin" as Section, label: "Administração", icon: <ShieldAlert size={15} /> },
    ] : [
      { id: "overview" as Section, label: "Visão Geral", icon: <Eye size={15} /> },
      { id: "loja" as Section, label: "Minha Loja", icon: <Store size={15} /> },
      { id: "produtos" as Section, label: "Serviços", icon: <Package size={15} /> },
      { id: "contactos" as Section, label: "Contactos", icon: <MessageCircle size={15} /> },
    ]),
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f1e7]"><p className="text-sm text-[#87909a]">Carregando...</p></div>;

  return (
    <div className="min-h-screen bg-[#f8f1e7] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#173a42] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-eliora-dark.svg" alt="Eliora Love Services" className="w-7 h-7 brightness-0 invert" style={{ filter: "brightness(0) invert(1)" }} />
          <span className="font-serif text-sm tracking-[0.08em]">Eliora <i className="font-normal">Love Services</i></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 z-30 w-64 bg-[#173a42] text-white h-screen p-6 flex flex-col overflow-y-auto transition-transform duration-300`}>
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo-eliora-dark.svg" alt="Eliora Love Services" className="w-8 h-8 brightness-0 invert" style={{ filter: "brightness(0) invert(1)" }} />
          <div>
            <p className="font-serif text-sm tracking-[0.08em]">Eliora <i className="font-normal">Love Services</i></p>
            <p className="text-[10px] text-white/50">Painel da loja</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                section === item.id
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="space-y-2 mt-auto pt-6 border-t border-white/10">
          <button onClick={() => window.location.href = "/love-services"} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
            <Store size={15} /> Ver site
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={15} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10 md:px-12">
          {section === "overview" && store && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-[#30343a]">Visão Geral</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#e8eaed] p-5">
                  <p className="text-[10px] text-[#87909a] uppercase tracking-wider mb-1">Serviços</p>
                  <p className="text-2xl font-bold text-[#30343a]">{store.products?.length || 0}</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#e8eaed] p-5">
                  <p className="text-[10px] text-[#87909a] uppercase tracking-wider mb-1">Estado</p>
                  <p className={`text-sm font-semibold ${store.isOpen ? "text-green-600" : "text-red-500"}`}>{store.isOpen ? "Aberto" : "Fechado"}</p>
                </div>
              </div>
            </div>
          )}

          {section === "loja" && store && (
            <LojaSection store={store} isDirty={isDirty} setDirty={setIsDirty} saveFnRef={saveFnRef} />
          )}

          {section === "produtos" && store && (
            <ProdutosSection store={store} />
          )}

          {section === "contactos" && store && (
            <div>
              <h2 className="font-serif text-3xl text-[#30343a] mb-8">Contactos</h2>
              <div className="bg-white rounded-2xl border border-[#e8eaed] p-8 max-w-2xl space-y-6">
                <div><label className={labelCls}>WhatsApp</label><a href={`https://wa.me/244${store.whatsapp || store.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#173a42] hover:underline"><MessageCircle size={16} /> {store.whatsapp || store.phone}</a></div>
                <div><label className={labelCls}>Telefone</label><p className="text-sm text-[#30343a]">{store.phone}</p></div>
                <div><label className={labelCls}>Endereço</label><p className="text-sm text-[#30343a]">{store.address || "Não definido"}</p></div>
              </div>
            </div>
          )}

          {section === "admin" && isAdmin && <LoveAdminPanel />}
        </div>
      </main>
    </div>
  );
}
