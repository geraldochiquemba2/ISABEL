export interface ProductSubcategory {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  subcategories: ProductSubcategory[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "moda",
    name: "Moda",
    subcategories: [
      { id: "roupas-femininas", name: "Roupas Femininas" },
      { id: "roupas-masculinas", name: "Roupas Masculinas" },
      { id: "calcados", name: "Calçados" },
      { id: "acessorios", name: "Acessórios" },
      { id: "bolsas", name: "Bolsas" },
      { id: "infantil", name: "Infantil" },
    ],
  },
  {
    id: "eletronicos",
    name: "Eletrônicos",
    subcategories: [
      { id: "smartphones", name: "Smartphones" },
      { id: "notebooks", name: "Notebooks & Computadores" },
      { id: "fones-audio", name: "Fones & Áudio" },
      { id: "games", name: "Games" },
      { id: "tv-som", name: "TV & Som" },
      { id: "acessorios-eletro", name: "Acessórios" },
    ],
  },
  {
    id: "alimentacao",
    name: "Alimentação",
    subcategories: [
      { id: "refeicoes", name: "Refeições" },
      { id: "lanches", name: "Lanches & Salgados" },
      { id: "bebidas", name: "Bebidas" },
      { id: "doces-sobremesas", name: "Doces & Sobremesas" },
      { id: "paes-confeitaria", name: "Pães & Confeitaria" },
      { id: "organicos", name: "Orgânicos & Naturais" },
    ],
  },
  {
    id: "saude-beleza",
    name: "Saúde & Beleza",
    subcategories: [
      { id: "cabelo", name: "Cabelo" },
      { id: "unhas", name: "Unhas" },
      { id: "maquiagem", name: "Maquiagem" },
      { id: "skincare", name: "Skincare" },
      { id: "medicamentos", name: "Medicamentos" },
      { id: "suplementos", name: "Suplementos" },
    ],
  },
  {
    id: "servicos-residenciais",
    name: "Serviços Residenciais",
    subcategories: [
      { id: "encanamento", name: "Encanamento" },
      { id: "eletrica", name: "Elétrica" },
      { id: "pintura", name: "Pintura" },
      { id: "limpeza", name: "Limpeza" },
      { id: "reformas", name: "Reformas" },
      { id: "ar-condicionado", name: "Ar Condicionado" },
    ],
  },
  {
    id: "automotivo",
    name: "Automotivo",
    subcategories: [
      { id: "mecanica", name: "Mecânica" },
      { id: "eletrica-veicular", name: "Elétrica Veicular" },
      { id: "funilaria", name: "Funilaria & Pintura" },
      { id: "pneus", name: "Pneus & Alinhamento" },
      { id: "acessorios-auto", name: "Acessórios" },
      { id: "lavagem", name: "Lavagem & Estética" },
    ],
  },
  {
    id: "educacao",
    name: "Educação",
    subcategories: [
      { id: "idiomas", name: "Idiomas" },
      { id: "cursos-profissionais", name: "Cursos Profissionais" },
      { id: "reforco-escolar", name: "Reforço Escolar" },
      { id: "artes-musica", name: "Artes & Música" },
      { id: "informatica", name: "Informática" },
      { id: "personal-trainer", name: "Personal Trainer" },
    ],
  },
  {
    id: "pets",
    name: "Pets",
    subcategories: [
      { id: "banho-tosa", name: "Banho & Tosa" },
      { id: "racoes", name: "Rações & Petiscos" },
      { id: "veterinario", name: "Veterinário" },
      { id: "acessorios-pet", name: "Acessórios" },
      { id: "adestramento", name: "Adestramento" },
      { id: "hotel-pet", name: "Hotel & Day Care" },
    ],
  },
];
