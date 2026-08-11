import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

interface CarrinhoProduct {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string | null;
  name: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  imageUrls: string[];
  imageColor: string;
  category: string | null;
  subcategory: string | null;
}

export default function VerCarrinhos() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CarrinhoProduct[]>([]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["carrinho-products"],
    queryFn: async () => {
      const res = await fetch("/api/products?is_carrinho=true");
      if (!res.ok) throw new Error("Erro ao buscar carrinhos");
      return res.json();
    },
  });

  const categories = [...new Set(products.map((p: CarrinhoProduct) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p: CarrinhoProduct) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: CarrinhoProduct) => {
    const exists = cart.find(item => item.id === product.id);
    if (!exists) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const sendToWhatsApp = () => {
    if (cart.length === 0) return;
    const phone = "244922001778";
    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Loja: ${item.storeName}\n`;
      message += `   Preço: ${item.price.toLocaleString("pt-AO")} ${item.currency}\n\n`;
    });
    
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    message += `💰 *Total: ${totalPrice.toLocaleString("pt-AO")} Kz*\n\n`;
    message += "Aguardo confirmação!";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer">
                  <ArrowLeft size={20} className="text-[#D4A843]" />
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} className="text-[#D4A843]" />
                <h1 className="text-xl font-bold text-gray-900">Carrinhos</h1>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar carrinhos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Categories filter */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? "bg-[#D4A843] text-white shadow-lg shadow-amber-500/30"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-amber-200"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as string)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#D4A843] text-white shadow-lg shadow-amber-500/30"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-amber-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum carrinho encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product: CarrinhoProduct) => {
                const inCart = cart.some(item => item.id === product.id);
                return (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative aspect-square overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: product.imageColor }}>
                          <ShoppingCart size={32} className="text-gray-300" />
                        </div>
                      )}
                      {product.storeLogo && (
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img src={product.storeLogo} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-[#D4A843] font-medium mb-1">{product.storeName}</p>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#D4A843]">
                          {product.price.toLocaleString("pt-AO")} {product.currency}
                        </span>
                        <button
                          onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            inCart
                              ? "bg-green-500 text-white"
                              : "bg-amber-50 text-[#D4A843] hover:bg-amber-100"
                          }`}
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart floating button */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={sendToWhatsApp}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8860B] text-white rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all"
            >
              <MessageCircle size={20} />
              <span className="font-semibold">Enviar ({cart.length})</span>
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
