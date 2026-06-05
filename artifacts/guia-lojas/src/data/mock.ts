export interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  imageColor: string;
  imageUrl?: string;
  imageUrls?: string[];
  category?: string;
  subcategory?: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  description?: string;
  coverColor?: string;
  coverImage?: string;
  coverImages?: string[];
  logoUrl?: string;
  products: Product[];
  province?: string;
  municipality?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: "moda", name: "Moda", icon: "shirt", count: 0 },
  { id: "eletronicos", name: "Eletrônicos", icon: "smartphone", count: 0 },
  { id: "alimentacao", name: "Alimentação", icon: "utensils", count: 0 },
  { id: "saude-beleza", name: "Saúde & Beleza", icon: "heart", count: 0 },
  { id: "servicos-residenciais", name: "Serviços Residenciais", icon: "home", count: 0 },
  { id: "automotivo", name: "Automotivo", icon: "car", count: 0 },
  { id: "educacao", name: "Educação", icon: "book-open", count: 0 },
  { id: "pets", name: "Pets", icon: "dog", count: 0 },
];

export const STORES: Store[] = [];
