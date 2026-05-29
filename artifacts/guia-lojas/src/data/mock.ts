export interface Product {
  id: string;
  name: string;
  price: number;
  imageColor: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  description: string;
  coverColor: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  storeId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export const CATEGORIES: Category[] = [
  { id: "moda", name: "Moda", icon: "shirt", count: 124 },
  { id: "eletronicos", name: "Eletrônicos", icon: "smartphone", count: 85 },
  { id: "alimentacao", name: "Alimentação", icon: "utensils", count: 320 },
  { id: "saude-beleza", name: "Saúde & Beleza", icon: "heart", count: 210 },
  { id: "servicos-residenciais", name: "Serviços Residenciais", icon: "home", count: 94 },
  { id: "automotivo", name: "Automotivo", icon: "car", count: 65 },
  { id: "educacao", name: "Educação", icon: "book-open", count: 42 },
  { id: "pets", name: "Pets", icon: "dog", count: 78 },
];

export const STORES: Store[] = [
  {
    id: "loja-1",
    name: "Boutique Elegance",
    category: "Moda",
    rating: 4.8,
    reviewCount: 124,
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 98765-4321",
    whatsapp: "5511987654321",
    isOpen: true,
    description: "Roupas femininas e acessórios com estilo e elegância. Peças exclusivas para todas as ocasiões.",
    coverColor: "#e8cfd9",
    products: [
      { id: "p1", name: "Vestido Floral", price: 189.90, imageColor: "#f3e1e8" },
      { id: "p2", name: "Blusa de Seda", price: 89.90, imageColor: "#d9e8e3" },
      { id: "p3", name: "Calça Pantalona", price: 159.90, imageColor: "#e8e5d9" },
      { id: "p4", name: "Bolsa de Couro", price: 299.90, imageColor: "#d9dbe8" },
    ]
  },
  {
    id: "loja-2",
    name: "Tech Soluções",
    category: "Eletrônicos",
    rating: 4.5,
    reviewCount: 89,
    address: "Av. Paulista, 1000 - Bela Vista",
    phone: "(11) 3210-9876",
    whatsapp: "5511932109876",
    isOpen: true,
    description: "Assistência técnica especializada em smartphones e notebooks. Venda de acessórios originais.",
    coverColor: "#d2dce6",
    products: [
      { id: "p5", name: "Cabo USB-C", price: 45.00, imageColor: "#e6d2d2" },
      { id: "p6", name: "Carregador Rápido", price: 120.00, imageColor: "#e6e1d2" },
      { id: "p7", name: "Fone Bluetooth", price: 199.90, imageColor: "#d2e6dc" },
      { id: "p8", name: "Capa Protetora", price: 35.00, imageColor: "#dcd2e6" },
    ]
  },
  {
    id: "loja-3",
    name: "Sabor de Casa",
    category: "Alimentação",
    rating: 4.9,
    reviewCount: 450,
    address: "Rua Augusta, 500 - Consolação",
    phone: "(11) 3333-4444",
    whatsapp: "5511933334444",
    isOpen: false,
    description: "Comida caseira com tempero de mãe. Marmitex e pratos feitos entregues quentinhos.",
    coverColor: "#e6d5c3",
    products: [
      { id: "p9", name: "Marmitex Executivo", price: 25.00, imageColor: "#c3e6d5" },
      { id: "p10", name: "Feijoada (Quarta/Sábado)", price: 35.00, imageColor: "#e6c3c3" },
      { id: "p11", name: "Suco Natural", price: 8.00, imageColor: "#d5c3e6" },
      { id: "p12", name: "Pudim Caseiro", price: 12.00, imageColor: "#c3d5e6" },
    ]
  },
  {
    id: "loja-4",
    name: "Salão Bella",
    category: "Saúde & Beleza",
    rating: 4.7,
    reviewCount: 215,
    address: "Rua Oscar Freire, 800 - Cerqueira César",
    phone: "(11) 5555-6666",
    whatsapp: "5511955556666",
    isOpen: true,
    description: "Cortes, coloração, manicure e pedicure. Profissionais atualizados com as últimas tendências.",
    coverColor: "#f0d5df",
    products: [
      { id: "p13", name: "Corte Feminino", price: 80.00, imageColor: "#dff0d5" },
      { id: "p14", name: "Manicure", price: 30.00, imageColor: "#d5dff0" },
      { id: "p15", name: "Escova Progressiva", price: 150.00, imageColor: "#f0e6d5" },
      { id: "p16", name: "Hidratação", price: 90.00, imageColor: "#e6d5f0" },
    ]
  },
  {
    id: "loja-5",
    name: "Encanador Express",
    category: "Serviços Residenciais",
    rating: 4.6,
    reviewCount: 78,
    address: "Atendimento a Domicílio",
    phone: "(11) 97777-8888",
    whatsapp: "5511977778888",
    isOpen: true,
    description: "Serviços de encanamento, desentupimento e pequenos reparos. Atendimento 24h para emergências.",
    coverColor: "#c8e1e6",
    products: [
      { id: "p17", name: "Visita Técnica", price: 50.00, imageColor: "#e6c8c8" },
      { id: "p18", name: "Desentupimento", price: 150.00, imageColor: "#e6e1c8" },
      { id: "p19", name: "Troca de Sifão", price: 80.00, imageColor: "#c8e6e1" },
      { id: "p20", name: "Reparo de Vazamento", price: 120.00, imageColor: "#e1c8e6" },
    ]
  },
  {
    id: "loja-6",
    name: "Auto Mecânica Confiança",
    category: "Automotivo",
    rating: 4.8,
    reviewCount: 156,
    address: "Av. Santo Amaro, 2000 - Vila Nova Conceição",
    phone: "(11) 4444-5555",
    whatsapp: "5511944445555",
    isOpen: true,
    description: "Revisão geral, troca de óleo, freios e suspensão. Orçamento transparente e peças de qualidade.",
    coverColor: "#cfd4cf",
    products: [
      { id: "p21", name: "Troca de Óleo", price: 180.00, imageColor: "#dfd4cf" },
      { id: "p22", name: "Revisão de Freios", price: 250.00, imageColor: "#cfdfd4" },
      { id: "p23", name: "Alinhamento", price: 100.00, imageColor: "#d4cfdf" },
      { id: "p24", name: "Higienização Ar", price: 90.00, imageColor: "#cfdfdf" },
    ]
  },
  {
    id: "loja-7",
    name: "Escola de Idiomas Fluency",
    category: "Educação",
    rating: 4.9,
    reviewCount: 340,
    address: "Rua Vergueiro, 1500 - Paraíso",
    phone: "(11) 2222-3333",
    whatsapp: "5511922223333",
    isOpen: true,
    description: "Cursos de Inglês e Espanhol para todas as idades. Metodologia interativa e professores nativos.",
    coverColor: "#d6cce6",
    products: [
      { id: "p25", name: "Mensalidade Inglês Adulto", price: 280.00, imageColor: "#e6d6cc" },
      { id: "p26", name: "Mensalidade Kids", price: 250.00, imageColor: "#cce6d6" },
      { id: "p27", name: "Aulas Particulares (h)", price: 90.00, imageColor: "#e6ccd6" },
      { id: "p28", name: "Material Didático", price: 150.00, imageColor: "#d6e6cc" },
    ]
  },
  {
    id: "loja-8",
    name: "Pet Shop Amigo Fiel",
    category: "Pets",
    rating: 4.7,
    reviewCount: 289,
    address: "Rua Joaquim Távora, 800 - Vila Mariana",
    phone: "(11) 6666-7777",
    whatsapp: "5511966667777",
    isOpen: false,
    description: "Banho e tosa com carinho. Rações premium, medicamentos e brinquedos para o seu melhor amigo.",
    coverColor: "#e6dcd2",
    products: [
      { id: "p29", name: "Banho P (Pelo Curto)", price: 45.00, imageColor: "#d2e6dc" },
      { id: "p30", name: "Tosa Higiênica", price: 30.00, imageColor: "#e6d2d2" },
      { id: "p31", name: "Ração Premium 15kg", price: 180.00, imageColor: "#d2dce6" },
      { id: "p32", name: "Coleira Antipulgas", price: 85.00, imageColor: "#dce6d2" },
    ]
  },
  {
    id: "loja-9",
    name: "Padaria Pão Quente",
    category: "Alimentação",
    rating: 4.5,
    reviewCount: 512,
    address: "Av. Lins de Vasconcelos, 1200 - Cambuci",
    phone: "(11) 8888-9999",
    whatsapp: "5511988889999",
    isOpen: true,
    description: "Pães fresquinhos a toda hora. Bolos, doces, frios e um café espresso imbatível.",
    coverColor: "#e6c3a1",
    products: [
      { id: "p33", name: "Pão Francês (kg)", price: 18.90, imageColor: "#a1e6c3" },
      { id: "p34", name: "Bolo de Cenoura", price: 25.00, imageColor: "#c3a1e6" },
      { id: "p35", name: "Café Espresso", price: 6.00, imageColor: "#e6a1c3" },
      { id: "p36", name: "Pão de Queijo", price: 4.50, imageColor: "#c3e6a1" },
    ]
  },
  {
    id: "loja-10",
    name: "Farmácia Vida",
    category: "Saúde & Beleza",
    rating: 4.6,
    reviewCount: 320,
    address: "Rua Domingos de Morais, 2500 - Vila Mariana",
    phone: "(11) 2121-2121",
    whatsapp: "5511921212121",
    isOpen: true,
    description: "Medicamentos, perfumaria e dermocosméticos. Farmacêutico sempre presente.",
    coverColor: "#cbe6c8",
    products: [
      { id: "p37", name: "Vitamina C", price: 35.90, imageColor: "#e6c8cb" },
      { id: "p38", name: "Protetor Solar", price: 68.00, imageColor: "#cbe6e6" },
      { id: "p39", name: "Shampoo Anticaspa", price: 28.50, imageColor: "#e6cbc8" },
      { id: "p40", name: "Aferição de Pressão", price: 0.00, imageColor: "#c8e6cb" },
    ]
  },
  {
    id: "loja-11",
    name: "Academia Fitness+",
    category: "Educação",
    rating: 4.8,
    reviewCount: 410,
    address: "Av. Jabaquara, 1000 - Mirandópolis",
    phone: "(11) 3131-3131",
    whatsapp: "5511931313131",
    isOpen: true,
    description: "Musculação, aulas de ginástica e lutas. Equipamentos modernos e professores qualificados.",
    coverColor: "#c4cfd6",
    products: [
      { id: "p41", name: "Plano Mensal", price: 120.00, imageColor: "#d6c4cf" },
      { id: "p42", name: "Plano Trimestral", price: 300.00, imageColor: "#cfd6c4" },
      { id: "p43", name: "Avaliação Física", price: 50.00, imageColor: "#c4d6cf" },
      { id: "p44", name: "Personal Trainer (h)", price: 80.00, imageColor: "#cfc4d6" },
    ]
  },
  {
    id: "loja-12",
    name: "Ótica Bem Estar",
    category: "Saúde & Beleza",
    rating: 4.7,
    reviewCount: 185,
    address: "Rua Teodoro Sampaio, 500 - Pinheiros",
    phone: "(11) 4141-4141",
    whatsapp: "5511941414141",
    isOpen: true,
    description: "Óculos de grau, sol e lentes de contato. Exame de vista grátis na compra do óculos completo.",
    coverColor: "#d4e6e6",
    products: [
      { id: "p45", name: "Armação Básica", price: 150.00, imageColor: "#e6d4d4" },
      { id: "p46", name: "Lente Antirreflexo", price: 200.00, imageColor: "#e6e6d4" },
      { id: "p47", name: "Óculos de Sol", price: 250.00, imageColor: "#d4d4e6" },
      { id: "p48", name: "Caixa Lente Contato", price: 120.00, imageColor: "#d4e6d4" },
    ]
  }
];

export const REVIEWS: Review[] = [
  { id: "r1", storeId: "loja-1", author: "Maria Silva", rating: 5, text: "Atendimento excelente e roupas de ótima qualidade!", date: "12 Out 2023" },
  { id: "r2", storeId: "loja-1", author: "Ana Souza", rating: 4, text: "Gostei bastante, mas os preços são um pouco altos.", date: "05 Set 2023" },
  { id: "r3", storeId: "loja-2", author: "Carlos Eduardo", rating: 5, text: "Consertaram meu celular super rápido. Recomendo!", date: "22 Nov 2023" },
  { id: "r4", storeId: "loja-3", author: "João Pedro", rating: 5, text: "A feijoada de sábado é a melhor da região.", date: "15 Dez 2023" },
  { id: "r5", storeId: "loja-3", author: "Fernanda Costa", rating: 4, text: "Comida muito saborosa, lembra muito casa de vó.", date: "10 Dez 2023" },
  { id: "r6", storeId: "loja-4", author: "Luciana Alves", rating: 5, text: "Sempre saio de lá me sentindo renovada. Profissionais incríveis.", date: "02 Jan 2024" },
  { id: "r7", storeId: "loja-5", author: "Roberto Nunes", rating: 4, text: "Chegou rápido e resolveu o problema do encanamento.", date: "18 Nov 2023" },
  { id: "r8", storeId: "loja-6", author: "Felipe Santos", rating: 5, text: "Preço justo e não inventam problemas que o carro não tem.", date: "30 Out 2023" },
  { id: "r9", storeId: "loja-7", author: "Beatriz Lima", rating: 5, text: "Minha filha está adorando as aulas de inglês.", date: "05 Fev 2024" },
  { id: "r10", storeId: "loja-8", author: "Patrícia Gomes", rating: 4, text: "Tratam muito bem os animais, mas as vezes atrasam o banho.", date: "20 Jan 2024" },
  { id: "r11", storeId: "loja-9", author: "Paulo Mendes", rating: 5, text: "Pão sempre quente de manhã, uma delícia.", date: "10 Fev 2024" },
  { id: "r12", storeId: "loja-10", author: "Juliana Castro", rating: 4, text: "Sempre encontro os remédios que preciso.", date: "15 Jan 2024" },
  { id: "r13", storeId: "loja-11", author: "Marcos Vinícius", rating: 5, text: "Aparelhagem nova e professores atenciosos.", date: "01 Fev 2024" },
  { id: "r14", storeId: "loja-12", author: "Camila Ribeiro", rating: 5, text: "Fiz o exame lá mesmo e já saí com o óculos novo encomendado.", date: "28 Dez 2023" },
  { id: "r15", storeId: "loja-1", author: "Sofia Martins", rating: 5, text: "A nova coleção está linda!", date: "10 Fev 2024" },
];
