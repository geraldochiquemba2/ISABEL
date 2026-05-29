export interface Product {
  id: string;
  name: string;
  price: number;
  imageColor: string;
  imageUrl?: string;
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
  description: string;
  coverColor: string;
  coverImage: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
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
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 98765-4321",
    whatsapp: "5511987654321",
    isOpen: true,
    description: "Roupas femininas e acessórios com estilo e elegância. Peças exclusivas para todas as ocasiões.",
    coverColor: "#e8cfd9",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p1", name: "Vestido Floral", price: 189.90, imageColor: "#f3e1e8", imageUrl: "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=400&h=400&fit=crop&auto=format&q=80", category: "Moda", subcategory: "Roupas Femininas" },
      { id: "p2", name: "Blusa de Seda", price: 89.90, imageColor: "#d9e8e3", imageUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=400&fit=crop&auto=format&q=80", category: "Moda", subcategory: "Roupas Femininas" },
      { id: "p3", name: "Calça Pantalona", price: 159.90, imageColor: "#e8e5d9", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&h=400&fit=crop&auto=format&q=80", category: "Moda", subcategory: "Roupas Femininas" },
      { id: "p4", name: "Bolsa de Couro", price: 299.90, imageColor: "#d9dbe8", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format&q=80", category: "Moda", subcategory: "Bolsas" },
    ]
  },
  {
    id: "loja-2",
    name: "Tech Soluções",
    category: "Eletrônicos",
    address: "Av. Paulista, 1000 - Bela Vista",
    phone: "(11) 3210-9876",
    whatsapp: "5511932109876",
    isOpen: true,
    description: "Assistência técnica especializada em smartphones e notebooks. Venda de acessórios originais.",
    coverColor: "#d2dce6",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p5", name: "Cabo USB-C", price: 45.00, imageColor: "#e6d2d2", imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop&auto=format&q=80", category: "Eletrônicos", subcategory: "Acessórios" },
      { id: "p6", name: "Carregador Rápido", price: 120.00, imageColor: "#e6e1d2", imageUrl: "https://images.unsplash.com/photo-1628815113969-0487917e8b76?w=400&h=400&fit=crop&auto=format&q=80", category: "Eletrônicos", subcategory: "Acessórios" },
      { id: "p7", name: "Fone Bluetooth", price: 199.90, imageColor: "#d2e6dc", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format&q=80", category: "Eletrônicos", subcategory: "Fones & Áudio" },
      { id: "p8", name: "Capa Protetora", price: 35.00, imageColor: "#dcd2e6", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&auto=format&q=80", category: "Eletrônicos", subcategory: "Acessórios" },
    ]
  },
  {
    id: "loja-3",
    name: "Sabor de Casa",
    category: "Alimentação",
    address: "Rua Augusta, 500 - Consolação",
    phone: "(11) 3333-4444",
    whatsapp: "5511933334444",
    isOpen: false,
    description: "Comida caseira com tempero de mãe. Marmitex e pratos feitos entregues quentinhos.",
    coverColor: "#e6d5c3",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p9", name: "Marmitex Executivo", price: 25.00, imageColor: "#c3e6d5", imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Refeições" },
      { id: "p10", name: "Feijoada", price: 35.00, imageColor: "#e6c3c3", imageUrl: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Refeições" },
      { id: "p11", name: "Suco Natural", price: 8.00, imageColor: "#d5c3e6", imageUrl: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Bebidas" },
      { id: "p12", name: "Pudim Caseiro", price: 12.00, imageColor: "#c3d5e6", imageUrl: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Doces & Sobremesas" },
    ]
  },
  {
    id: "loja-4",
    name: "Salão Bella",
    category: "Saúde & Beleza",
    address: "Rua Oscar Freire, 800 - Cerqueira César",
    phone: "(11) 5555-6666",
    whatsapp: "5511955556666",
    isOpen: true,
    description: "Cortes, coloração, manicure e pedicure. Profissionais atualizados com as últimas tendências.",
    coverColor: "#f0d5df",
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p13", name: "Corte Feminino", price: 80.00, imageColor: "#dff0d5", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Cabelo" },
      { id: "p14", name: "Manicure", price: 30.00, imageColor: "#d5dff0", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Unhas" },
      { id: "p15", name: "Escova Progressiva", price: 150.00, imageColor: "#f0e6d5", imageUrl: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Cabelo" },
      { id: "p16", name: "Hidratação", price: 90.00, imageColor: "#e6d5f0", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Cabelo" },
    ]
  },
  {
    id: "loja-5",
    name: "Encanador Express",
    category: "Serviços Residenciais",
    address: "Atendimento a Domicílio",
    phone: "(11) 97777-8888",
    whatsapp: "5511977778888",
    isOpen: true,
    description: "Serviços de encanamento, desentupimento e pequenos reparos. Atendimento 24h para emergências.",
    coverColor: "#c8e1e6",
    coverImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p17", name: "Visita Técnica", price: 50.00, imageColor: "#e6c8c8", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&auto=format&q=80", category: "Serviços Residenciais", subcategory: "Encanamento" },
      { id: "p18", name: "Desentupimento", price: 150.00, imageColor: "#e6e1c8", imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format&q=80", category: "Serviços Residenciais", subcategory: "Encanamento" },
      { id: "p19", name: "Troca de Sifão", price: 80.00, imageColor: "#c8e6e1", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=400&h=400&fit=crop&auto=format&q=80", category: "Serviços Residenciais", subcategory: "Encanamento" },
      { id: "p20", name: "Reparo de Vazamento", price: 120.00, imageColor: "#e1c8e6", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format&q=80", category: "Serviços Residenciais", subcategory: "Encanamento" },
    ]
  },
  {
    id: "loja-6",
    name: "Auto Mecânica Confiança",
    category: "Automotivo",
    address: "Av. Santo Amaro, 2000 - Vila Nova Conceição",
    phone: "(11) 4444-5555",
    whatsapp: "5511944445555",
    isOpen: true,
    description: "Revisão geral, troca de óleo, freios e suspensão. Orçamento transparente e peças de qualidade.",
    coverColor: "#cfd4cf",
    coverImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p21", name: "Troca de Óleo", price: 180.00, imageColor: "#dfd4cf", imageUrl: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=400&fit=crop&auto=format&q=80", category: "Automotivo", subcategory: "Mecânica" },
      { id: "p22", name: "Revisão de Freios", price: 250.00, imageColor: "#cfdfd4", imageUrl: "https://images.unsplash.com/photo-1609629843816-d29a2f45c48e?w=400&h=400&fit=crop&auto=format&q=80", category: "Automotivo", subcategory: "Mecânica" },
      { id: "p23", name: "Alinhamento", price: 100.00, imageColor: "#d4cfdf", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format&q=80", category: "Automotivo", subcategory: "Pneus & Alinhamento" },
      { id: "p24", name: "Higienização Ar", price: 90.00, imageColor: "#cfdfdf", imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=400&fit=crop&auto=format&q=80", category: "Automotivo", subcategory: "Lavagem & Estética" },
    ]
  },
  {
    id: "loja-7",
    name: "Escola de Idiomas Fluency",
    category: "Educação",
    address: "Rua Vergueiro, 1500 - Paraíso",
    phone: "(11) 2222-3333",
    whatsapp: "5511922223333",
    isOpen: true,
    description: "Cursos de Inglês e Espanhol para todas as idades. Metodologia interativa e professores nativos.",
    coverColor: "#d6cce6",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p25", name: "Mensalidade Inglês Adulto", price: 280.00, imageColor: "#e6d6cc", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Idiomas" },
      { id: "p26", name: "Mensalidade Kids", price: 250.00, imageColor: "#cce6d6", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Idiomas" },
      { id: "p27", name: "Aulas Particulares (h)", price: 90.00, imageColor: "#e6ccd6", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Idiomas" },
      { id: "p28", name: "Material Didático", price: 150.00, imageColor: "#d6e6cc", imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Cursos Profissionais" },
    ]
  },
  {
    id: "loja-8",
    name: "Pet Shop Amigo Fiel",
    category: "Pets",
    address: "Rua Joaquim Távora, 800 - Vila Mariana",
    phone: "(11) 6666-7777",
    whatsapp: "5511966667777",
    isOpen: false,
    description: "Banho e tosa com carinho. Rações premium, medicamentos e brinquedos para o seu melhor amigo.",
    coverColor: "#e6dcd2",
    coverImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p29", name: "Banho P", price: 45.00, imageColor: "#d2e6dc", imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=400&fit=crop&auto=format&q=80", category: "Pets", subcategory: "Banho & Tosa" },
      { id: "p30", name: "Tosa Higiênica", price: 30.00, imageColor: "#e6d2d2", imageUrl: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400&h=400&fit=crop&auto=format&q=80", category: "Pets", subcategory: "Banho & Tosa" },
      { id: "p31", name: "Ração Premium 15kg", price: 180.00, imageColor: "#d2dce6", imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop&auto=format&q=80", category: "Pets", subcategory: "Rações & Petiscos" },
      { id: "p32", name: "Coleira Antipulgas", price: 85.00, imageColor: "#dce6d2", imageUrl: "https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=400&h=400&fit=crop&auto=format&q=80", category: "Pets", subcategory: "Acessórios" },
    ]
  },
  {
    id: "loja-9",
    name: "Padaria Pão Quente",
    category: "Alimentação",
    address: "Av. Lins de Vasconcelos, 1200 - Cambuci",
    phone: "(11) 8888-9999",
    whatsapp: "5511988889999",
    isOpen: true,
    description: "Pães fresquinhos a toda hora. Bolos, doces, frios e um café espresso imbatível.",
    coverColor: "#e6c3a1",
    coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p33", name: "Pão Francês (kg)", price: 18.90, imageColor: "#a1e6c3", imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Pães & Confeitaria" },
      { id: "p34", name: "Bolo de Cenoura", price: 25.00, imageColor: "#c3a1e6", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Doces & Sobremesas" },
      { id: "p35", name: "Café Espresso", price: 6.00, imageColor: "#e6a1c3", imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Bebidas" },
      { id: "p36", name: "Pão de Queijo", price: 4.50, imageColor: "#c3e6a1", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop&auto=format&q=80", category: "Alimentação", subcategory: "Pães & Confeitaria" },
    ]
  },
  {
    id: "loja-10",
    name: "Farmácia Vida",
    category: "Saúde & Beleza",
    address: "Rua Domingos de Morais, 2500 - Vila Mariana",
    phone: "(11) 2121-2121",
    whatsapp: "5511921212121",
    isOpen: true,
    description: "Medicamentos, perfumaria e dermocosméticos. Farmacêutico sempre presente.",
    coverColor: "#cbe6c8",
    coverImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p37", name: "Vitamina C", price: 35.90, imageColor: "#e6c8cb", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Suplementos" },
      { id: "p38", name: "Protetor Solar", price: 68.00, imageColor: "#cbe6e6", imageUrl: "https://images.unsplash.com/photo-1556228724-60d4a6743f1e?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Skincare" },
      { id: "p39", name: "Shampoo Anticaspa", price: 28.50, imageColor: "#e6cbc8", imageUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Cabelo" },
      { id: "p40", name: "Aferição de Pressão", price: 0.00, imageColor: "#c8e6cb", imageUrl: "https://images.unsplash.com/photo-1559757175-7cb036e0b8a0?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Medicamentos" },
    ]
  },
  {
    id: "loja-11",
    name: "Academia Fitness+",
    category: "Educação",
    address: "Av. Jabaquara, 1000 - Mirandópolis",
    phone: "(11) 3131-3131",
    whatsapp: "5511931313131",
    isOpen: true,
    description: "Musculação, aulas de ginástica e lutas. Equipamentos modernos e professores qualificados.",
    coverColor: "#c4cfd6",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p41", name: "Plano Mensal", price: 120.00, imageColor: "#d6c4cf", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Personal Trainer" },
      { id: "p42", name: "Plano Trimestral", price: 300.00, imageColor: "#cfd6c4", imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Personal Trainer" },
      { id: "p43", name: "Avaliação Física", price: 50.00, imageColor: "#c4d6cf", imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Personal Trainer" },
      { id: "p44", name: "Personal Trainer (h)", price: 80.00, imageColor: "#cfc4d6", imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=400&fit=crop&auto=format&q=80", category: "Educação", subcategory: "Personal Trainer" },
    ]
  },
  {
    id: "loja-12",
    name: "Ótica Bem Estar",
    category: "Saúde & Beleza",
    address: "Rua Teodoro Sampaio, 500 - Pinheiros",
    phone: "(11) 4141-4141",
    whatsapp: "5511941414141",
    isOpen: true,
    description: "Óculos de grau, sol e lentes de contato. Exame de vista grátis na compra do óculos completo.",
    coverColor: "#d4e6e6",
    coverImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=500&fit=crop&auto=format&q=80",
    products: [
      { id: "p45", name: "Armação Básica", price: 150.00, imageColor: "#e6d4d4", imageUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Skincare" },
      { id: "p46", name: "Lente Antirreflexo", price: 200.00, imageColor: "#e6e6d4", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Skincare" },
      { id: "p47", name: "Óculos de Sol", price: 250.00, imageColor: "#d4d4e6", imageUrl: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Skincare" },
      { id: "p48", name: "Lente de Contato", price: 120.00, imageColor: "#d4e6d4", imageUrl: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=400&h=400&fit=crop&auto=format&q=80", category: "Saúde & Beleza", subcategory: "Medicamentos" },
    ]
  }
];
