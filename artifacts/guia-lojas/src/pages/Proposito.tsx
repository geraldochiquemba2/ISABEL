import { useState, useRef } from "react";
import { ArrowLeft, Heart, Plus, X, LogOut, Pencil, Check, Upload } from "lucide-react";

const DEFAULT_PHOTOS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Crianças felizes recibindo amor e cuidado",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Comunidades unidas em propósito",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Ajuda que transforma vidas",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Servir é amar em acção",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Cada compra faz a diferença",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format&q=80",
    caption: "Amor que não tem limites",
  },
];

interface Photo {
  id: number;
  image: string;
  caption: string;
}

export default function Proposito() {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem("yesola-proposito-photos");
    return saved ? JSON.parse(saved) : DEFAULT_PHOTOS;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savePhotos = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    localStorage.setItem("yesola-proposito-photos", JSON.stringify(newPhotos));
  };

  const handleLogin = () => {
    if (loginPhone === "999999999" && loginPassword === "1234567890") {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, filename: `proposito-${Date.now()}.jpg` }),
        });
        const data = await res.json();
        if (data.imageUrl) {
          setNewImage(data.imageUrl);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const handleAddPost = () => {
    if (newImage && newCaption) {
      const newPhotos = [{ id: Date.now(), image: newImage, caption: newCaption }, ...photos];
      savePhotos(newPhotos);
      setNewImage("");
      setNewCaption("");
      setShowAddPost(false);
    }
  };

  const handleDeletePost = (id: number) => {
    savePhotos(photos.filter((p) => p.id !== id));
  };

  const handleStartEdit = (id: number, currentCaption: string) => {
    setEditingId(id);
    setEditCaption(currentCaption);
  };

  const handleSaveEdit = (id: number) => {
    savePhotos(photos.map((p) => (p.id === id ? { ...p, caption: editCaption } : p)));
    setEditingId(null);
    setEditCaption("");
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#2D2C2B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE8DE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#2D2C2B] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 600, color: "#2d2c2b" }}>YESOLA</span>
          {isAdmin ? (
            <button onClick={() => setIsAdmin(false)} className="p-2 text-[#6B7280] hover:text-[#2D2C2B]">
              <LogOut size={18} />
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="text-[11px] text-[#D4A843] font-medium">Admin</button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 py-8 text-center">
        <h1 className="text-[28px] font-semibold text-[#D4A843]" style={{ fontFamily: "'Playfair Display', serif" }}>
          YESOLA com propósito ♥
        </h1>
        <p className="text-[14px] text-[#D4A843]/80 italic mt-2">porque Jesus é amor.</p>
        <p className="text-[13px] text-[#6B7280] mt-4 leading-relaxed max-w-md mx-auto">
          Ao escolher a YESOLA, ajudas a transformar vidas e fazer alguém feliz.
        </p>
      </section>

      {/* Admin Add Button */}
      {isAdmin && (
        <section className="px-5 py-2">
          <button onClick={() => setShowAddPost(true)} className="w-full flex items-center justify-center gap-2 bg-[#D4A843] text-white text-[13px] font-medium px-4 py-3 rounded-xl hover:bg-[#C49A38] transition-colors">
            <Plus size={16} /> Adicionar acção solidária
          </button>
        </section>
      )}

      {/* Photos Grid */}
      <section className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="rounded-2xl overflow-hidden bg-white border border-[#EDE8DE] relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={photo.image} alt={photo.caption} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                {isAdmin && editingId === photo.id ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg border border-[#EDE8DE] text-[11px] focus:outline-none focus:border-[#D4A843]"
                    />
                    <button onClick={() => handleSaveEdit(photo.id)} className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">{photo.caption}</p>
                )}
              </div>
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {editingId !== photo.id && (
                    <button onClick={() => handleStartEdit(photo.id, photo.caption)} className="bg-[#D4A843] text-white p-1.5 rounded-full hover:bg-[#C49A38] transition-colors">
                      <Pencil size={12} />
                    </button>
                  )}
                  <button onClick={() => handleDeletePost(photo.id)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help Button */}
      <section className="px-5 py-4">
        <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20ajudar%20a%20YESOLA%20com%20propósito." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-[13px] font-medium px-4 py-3 rounded-xl hover:bg-[#128C7E] transition-colors w-full">
          <Heart size={16} /> Ajudar a YESOLA
        </a>
      </section>

      {/* Message */}
      <section className="px-5 py-4 text-center">
        <div className="bg-[#FBF7ED] rounded-2xl p-6 border border-[#EDE8DE]">
          <Heart size={24} className="text-[#D4A843] mx-auto mb-3" />
          <p className="text-[14px] text-[#2D2C2B] font-medium leading-relaxed">
            Cada compra é um acto de amor.
          </p>
          <p className="text-[12px] text-[#6B7280] mt-2">
            Obrigado por fazer parte desta história.
          </p>
        </div>
      </section>

      <div className="text-center py-6">
        <p className="text-xs text-[#9CA3AF]">© 2024 YESOLA. Todos os direitos reservados.</p>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#2D2C2B]">Login Admin</h3>
              <button onClick={() => setShowLogin(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] text-[#6B7280] font-medium">Telefone</label>
                <input type="text" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="999999999" className="w-full px-4 py-3 rounded-xl border border-[#EDE8DE] text-sm focus:outline-none focus:border-[#D4A843]" />
              </div>
              <div>
                <label className="text-[12px] text-[#6B7280] font-medium">Senha</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••••" className="w-full px-4 py-3 rounded-xl border border-[#EDE8DE] text-sm focus:outline-none focus:border-[#D4A843]" />
              </div>
              {loginError && <p className="text-[12px] text-red-500">{loginError}</p>}
              <button onClick={handleLogin} className="w-full bg-[#D4A843] text-white py-3 rounded-xl font-medium hover:bg-[#C49A38] transition-colors">
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowAddPost(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#2D2C2B]">Nova acção solidária</h3>
              <button onClick={() => setShowAddPost(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] text-[#6B7280] font-medium">Enviar foto</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#D4A843] text-[#D4A843] text-[13px] font-medium hover:bg-[#FBF7ED] transition-colors disabled:opacity-50">
                  <Upload size={16} /> {uploading ? "A enviar para Telegram..." : "Escolher foto"}
                </button>
                {newImage && <p className="text-[11px] text-green-600 mt-2">✓ Foto enviada com sucesso</p>}
              </div>
              <div>
                <label className="text-[12px] text-[#6B7280] font-medium">Legenda</label>
                <textarea value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="Descreva a acção solidária..." rows={3} className="w-full px-4 py-3 rounded-xl border border-[#EDE8DE] text-sm focus:outline-none focus:border-[#D4A843] resize-none" />
              </div>
              <button onClick={handleAddPost} disabled={!newImage || !newCaption} className="w-full bg-[#D4A843] text-white py-3 rounded-xl font-medium hover:bg-[#C49A38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
