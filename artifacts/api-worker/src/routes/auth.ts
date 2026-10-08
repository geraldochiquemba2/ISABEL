import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";
import { hashPassword, verifyPassword, isDefaultPassword } from "@workspace/password";

const CATEGORY_LABELS: Record<string, string> = {
  moda: "Moda",
  calcado: "Calçado",
  "bolsas-acessorios": "Bolsas & Acessórios",
  "joias-bijutarias": "Jóias & Bijutarias",
  "tecnologia-eletronicos": "Tecnologia & Electrónicos",
  "tecnologia-electrónicos": "Tecnologia & Electrónicos",
  eletronicos: "Tecnologia & Electrónicos",
  eletrônicos: "Tecnologia & Electrónicos",
  telemoveis: "Tecnologia & Electrónicos",
  computadores: "Tecnologia & Electrónicos",
  electrodomicilios: "Tecnologia & Electrónicos",
  reparacao: "Tecnologia & Electrónicos",
  internet: "Tecnologia & Electrónicos",
  software: "Tecnologia & Electrónicos",
  seguranca: "Tecnologia & Electrónicos",
  "alimentacao-restauracao": "Alimentação & Restauração",
  alimentacao: "Alimentação & Restauração",
  restaurantes: "Alimentação & Restauração",
  pastelarias: "Alimentação & Restauração",
  fastfood: "Alimentação & Restauração",
  catering: "Alimentação & Restauração",
  supermercados: "Alimentação & Restauração",
  talhos: "Alimentação & Restauração",
  padarias: "Alimentação & Restauração",
  bebidas: "Alimentação & Restauração",
  produtos: "Alimentação & Restauração",
  entregas: "Alimentação & Restauração",
  "turismo-lazer": "Turismo & Lazer",
  turismo: "Turismo & Lazer",
  agencias: "Turismo & Lazer",
  passeios: "Turismo & Lazer",
  experiencias: "Turismo & Lazer",
  parques: "Turismo & Lazer",
  actividades: "Turismo & Lazer",
  cultural: "Turismo & Lazer",
  guias: "Turismo & Lazer",
  "desporto-fitness": "Desporto & Fitness",
  desporto: "Desporto & Fitness",
  ginasios: "Desporto & Fitness",
  personal: "Desporto & Fitness",
  clubes: "Desporto & Fitness",
  futebol: "Desporto & Fitness",
  natacao: "Desporto & Fitness",
  "artes-marciais": "Desporto & Fitness",
  equipamentos: "Desporto & Fitness",
  danca: "Desporto & Fitness",
  "empregos-oportunidades": "Empregos & Oportunidades",
  empregos: "Empregos & Oportunidades",
  vagas: "Empregos & Oportunidades",
  estagios: "Empregos & Oportunidades",
  primeiro: "Empregos & Oportunidades",
  temporario: "Empregos & Oportunidades",
  freelancer: "Empregos & Oportunidades",
  recrutamento: "Empregos & Oportunidades",
  "agricultura-agronegocio": "Agricultura & Agro-Negócio",
  agricultura: "Agricultura & Agro-Negócio",
  pecuaria: "Agricultura & Agro-Negócio",
  produtores: "Agricultura & Agro-Negócio",
  sementes: "Agricultura & Agro-Negócio",
  maquinas: "Agricultura & Agro-Negócio",
  avicultura: "Agricultura & Agro-Negócio",
  pesca: "Agricultura & Agro-Negócio",
  "produtos-agricolas": "Agricultura & Agro-Negócio",
  "servicos-agricolas": "Agricultura & Agro-Negócio",
  "influenciadores-criadores": "Influenciadores & Criadores",
  influenciadores: "Influenciadores & Criadores",
  "criadores-conteudo": "Influenciadores & Criadores",
  ugc: "Influenciadores & Criadores",
  videomakers: "Influenciadores & Criadores",
  fotografos: "Influenciadores & Criadores",
  apresentadores: "Influenciadores & Criadores",
  podcasters: "Influenciadores & Criadores",
  streamers: "Influenciadores & Criadores",
  modelos: "Influenciadores & Criadores",
  "transportes-logistica": "Transportes & Logística",
  transportes: "Transportes & Logística",
  interprovincial: "Transportes & Logística",
  mudancas: "Transportes & Logística",
  passageiros: "Transportes & Logística",
  cargas: "Transportes & Logística",
  logistica: "Transportes & Logística",
  aluguer: "Transportes & Logística",
  "servicos-profissionais": "Serviços Profissionais",
  documentacao: "Serviços Profissionais",
  consultoria: "Serviços Profissionais",
  secretariado: "Serviços Profissionais",
  arquitetura: "Serviços Profissionais",
  traducao: "Serviços Profissionais",
  design: "Serviços Profissionais",
  cerimonial: "Serviços Profissionais",
  "beleza-bem-estar": "Beleza & Bem-Estar",
  "saude-beleza": "Beleza & Bem-Estar",
  "saúde-beleza": "Beleza & Bem-Estar",
  "saúde & beleza": "Beleza & Bem-Estar",
  saude: "Beleza & Bem-Estar",
  beleza: "Beleza & Bem-Estar",
  "casa-servicos": "Casa & Serviços",
  "servicos-residenciais": "Casa & Serviços",
  "casa & decoração": "Casa & Serviços",
  servicos: "Casa & Serviços",
  serviços: "Casa & Serviços",
  automotivo: "Automóveis & Mobilidade",
  motores: "Automóveis & Mobilidade",
  "auto motores": "Automóveis & Mobilidade",
  "auto-motores": "Automóveis & Mobilidade",
  educacao: "Educação & Formação",
  pets: "Pets",
};

export function normalizeCategory(category?: string) {
  if (!category) return "Geral";
  const normalized = category.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] || category;
}

// Normaliza até 4 categorias (a primeira é a principal)
function normalizeStoreCategories(body: any): { primary: string; all: string[] } {
  const raw = Array.isArray(body?.categories)
    ? body.categories.filter((c: any) => typeof c === "string" && c.trim())
    : [];
  const seen = new Set<string>();
  const all: string[] = [];
  for (const c of [...raw, body?.category].filter(Boolean)) {
    const v = normalizeCategory(String(c));
    if (v && !seen.has(v)) {
      seen.add(v);
      all.push(v);
    }
    if (all.length >= 4) break;
  }
  const primary = all[0] || "Geral";
  return { primary, all: all.length ? all : [primary] };
}

const cl = (category: any) => String(category || "").toLowerCase();

// Cadeia completa (registo e procura de utilizador no original).
function storeTypeFromCategory(category: any): string {
  const c = cl(category);
  if (c.includes("wedding")) return "weddings";
  if (c.includes("love")) return "love-services";
  if (c.includes("business")) return "business";
  if (c.includes("formacao")) return "formacoes";
  if (c.includes("evento")) return "eventos";
  if (c.includes("entretenimento")) return "entretenimento";
  if (c.includes("imovel")) return "imoveis";
  if (c.includes("infantil")) return "infantil";
  if (c.includes("automovel")) return "automoveis";
  if (c.includes("saude")) return "saude";
  if (c.includes("beleza")) return "beleza";
  if (c.includes("casa")) return "casa";
  if (c.includes("tecnologia")) return "tecnologia-electronicos";
  if (c.includes("alimentacao")) return "alimentacao-restauracao";
  if (c.includes("turismo")) return "turismo-lazer";
  if (c.includes("desporto")) return "desporto-fitness";
  if (c.includes("emprego")) return "empregos-oportunidades";
  if (c.includes("agricultur")) return "agricultura-agronegocio";
  if (c.includes("influenciador")) return "influenciadores-criadores";
  if (c.includes("transporte")) return "transportes-logistica";
  if (c.includes("profissional")) return "servicos-profissionais";
  return "collection";
}

// Cadeia curta do link-store original (termina em casa -> collection).
function storeTypeFromCategoryShort(category: any): string {
  const c = cl(category);
  if (c.includes("wedding")) return "weddings";
  if (c.includes("love")) return "love-services";
  if (c.includes("business")) return "business";
  if (c.includes("formacao")) return "formacoes";
  if (c.includes("evento")) return "eventos";
  if (c.includes("entretenimento")) return "entretenimento";
  if (c.includes("imovel")) return "imoveis";
  if (c.includes("infantil")) return "infantil";
  if (c.includes("automovel")) return "automoveis";
  if (c.includes("saude")) return "saude";
  if (c.includes("beleza")) return "beleza";
  if (c.includes("casa")) return "casa";
  return "collection";
}

function coverColorFor(storeType: string): string {
  switch (storeType) {
    case "love-services": return "#A71936";
    case "business": return "#075342";
    case "formacoes": return "#1E737B";
    case "eventos": return "#C45125";
    case "entretenimento": return "#7C3AED";
    case "imoveis": return "#0B2D56";
    case "infantil": return "#F7C948";
    case "automoveis": return "#0f1d32";
    case "saude": return "#2E7D32";
    case "beleza": return "#7A4549";
    case "casa": return "#68635D";
    case "tecnologia-electronicos": return "#1565C0";
    case "alimentacao-restauracao": return "#D84315";
    case "turismo-lazer": return "#00796B";
    case "desporto-fitness": return "#E65100";
    case "empregos-oportunidades": return "#4527A0";
    case "agricultura-agronegocio": return "#2E7D32";
    case "influenciadores-criadores": return "#C2185B";
    case "transportes-logistica": return "#F57F17";
    case "servicos-profissionais": return "#1A237E";
    default: return "#B89A78";
  }
}

function descriptionFor(storeType: string): string {
  switch (storeType) {
    case "love-services": return "A minha loja na YESOLA Serviços de Amor.";
    case "weddings": return "A minha loja na YESOLA Casamentos.";
    case "business": return "A minha loja na YESOLA Negócios & Finanças.";
    case "formacoes": return "A minha loja na YESOLA Formações & Cursos.";
    case "eventos": return "A minha loja na YESOLA Eventos & Celebrações.";
    case "entretenimento": return "A minha loja na YESOLA Entretenimento.";
    case "imoveis": return "A minha loja na YESOLA Imóveis & Alojamento.";
    case "infantil": return "A minha loja na YESOLA Infantil & Maternidade.";
    case "automoveis": return "A minha loja na YESOLA Automóveis.";
    case "saude": return "A minha loja na YESOLA Saúde & Bem-Estar.";
    case "beleza": return "A minha loja na YESOLA Beleza & Bem-Estar.";
    case "casa": return "A minha loja na YESOLA Casa & Serviços.";
    case "tecnologia-electronicos": return "A minha loja na YESOLA Tecnologia & Electrónicos.";
    case "alimentacao-restauracao": return "A minha loja na YESOLA Alimentação & Restauração.";
    case "turismo-lazer": return "A minha loja na YESOLA Turismo & Lazer.";
    case "desporto-fitness": return "A minha loja na YESOLA Desporto & Fitness.";
    case "empregos-oportunidades": return "A minha loja na YESOLA Empregos & Oportunidades.";
    case "agricultura-agronegocio": return "A minha loja na YESOLA Agricultura & Agro-Negócio.";
    case "influenciadores-criadores": return "A minha loja na YESOLA Influenciadores & Criadores.";
    case "transportes-logistica": return "A minha loja na YESOLA Transportes & Logística.";
    case "servicos-profissionais": return "A minha loja na YESOLA Serviços Profissionais.";
    default: return "A minha loja na YESOLA Collection.";
  }
}

function coverImageFor(storeType: string): string {
  const u = (id: string) => `https://images.unsplash.com/${id}?w=800&h=500&fit=crop&auto=format&q=80`;
  switch (storeType) {
    case "love-services": return u("photo-1529603095155-15342c491f1a");
    case "weddings": return u("photo-1519741497674-611481863552");
    case "business": return u("photo-1507003211169-0a1dd7228f2d");
    case "formacoes": return u("photo-1524178232363-6fb168ff49fe");
    case "eventos": return u("photo-1511795409834-ef04bbd61622");
    case "entretenimento": return u("photo-1470229722913-7c0e2dbbafd3");
    case "imoveis": return u("photo-1560518883-ce09059eeffa");
    case "infantil": return u("photo-1476703993599-0035a21b17a9");
    case "automoveis": return u("photo-1492144534655-ae79c964c9d7");
    case "saude": return u("photo-1571019613454-1cb2f99b2d8b");
    case "beleza": return u("photo-1560066984-138dadb4c035");
    case "casa": return u("photo-1556909114-f6e7ad7d3136");
    case "tecnologia-electronicos": return u("photo-1498049794561-7780e7231661");
    case "alimentacao-restauracao": return u("photo-1555396273-367ea4eb4db5");
    case "turismo-lazer": return u("photo-1476514525535-07fb3b4ae5f1");
    case "desporto-fitness": return u("photo-1534438327276-14e5300c3a48");
    case "empregos-oportunidades": return u("photo-1521737711867-e3b97375f902");
    case "agricultura-agronegocio": return u("photo-1500382017468-9049fed747ef");
    case "influenciadores-criadores": return u("photo-1611162617213-7d7a39e9b1d7");
    case "transportes-logistica": return u("photo-1586528116311-ad8dd3c8310d");
    case "servicos-profissionais": return u("photo-1454165804606-c3d57bc86b40");
    default: return u("photo-1441986300917-64674bd600d8");
  }
}

export const authRouter = new Hono<{ Bindings: Env }>();

// POST /api/auth/register — Registo do Lojista
authRouter.post("/register", async (c) => {
  try {
    const body = (await c.req.json()) as any;
    const { storeName, phone, password, category, province, municipality, address, storeType: storeTypeFromClient, latitude, longitude } = body;
    const { primary: normalizedCategory, all: normalizedCategories } = normalizeStoreCategories(body);
    const storeType = storeTypeFromClient || storeTypeFromCategory(category);

    // Verificar se número já existe NESTE store_type
    const exists = (await db(c.env).query("SELECT * FROM users WHERE phone=$1 AND store_type=$2", [phone, storeType])) as any[];
    if (exists.length) {
      return c.json({ error: "Este número de telefone já está registado nesta plataforma." }, 400);
    }

    // Criar uma nova loja automaticamente para este utilizador
    const storeId = `loja-${Date.now()}`;
    const description = descriptionFor(storeType);
    const coverColor = coverColorFor(storeType);
    const coverImage = coverImageFor(storeType);

    await db(c.env).query(
      `INSERT INTO stores (id, name, category, categories, address, phone, whatsapp, description, cover_color, cover_image, province, municipality, locality, store_type, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        storeId,
        storeName || "Minha Loja",
        normalizedCategory,
        normalizedCategories,
        address || "",
        phone || "",
        description,
        coverColor,
        coverImage,
        province || "",
        municipality || "",
        body.locality || "",
        storeType,
        latitude || null,
        longitude || null,
      ]
    );

    // Inserir Utilizador
    const created = (await db(c.env).query(
      `INSERT INTO users (name, phone, password, province, municipality, address, store_id, store_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDENTE') RETURNING id, name, phone, store_id, status, status_reason`,
      [storeName || "Lojista", phone, await hashPassword(password), province || "", municipality || "", address || "", storeId, storeType]
    )) as any[];

    const user = created[0];
    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        storeId: user.store_id,
        status: user.status,
        statusReason: user.status_reason,
      },
    });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err?.message || err);
    return c.json({ error: err?.message || "Erro ao criar conta." }, 500);
  }
});

// POST /api/auth/login — Login do Lojista
authRouter.post("/login", async (c) => {
  try {
    const { phone, password, storeType } = await c.req.json();
    const store_type = storeType || "collection";
    const rows = (await db(c.env).query("SELECT * FROM users WHERE phone=$1 AND store_type=$2", [phone, store_type])) as any[];
    if (!rows.length) {
      return c.json({ error: "Telefone ou senha incorretos." }, 400);
    }

    const user = rows[0];
    // Aceita hash novo OU plaintext legado (converte para hash neste login).
    if (!(await verifyPassword(user.password, password))) {
      return c.json({ error: "Telefone ou senha incorretos." }, 400);
    }
    if (typeof user.password === "string" && !user.password.startsWith("pbkdf2$")) {
      user.password = await hashPassword(password);
      await db(c.env).query("UPDATE users SET password = $2 WHERE id = $1", [user.id, user.password]);
    }
    if (user.status === "PENDENTE") {
      return c.json({ error: "A sua conta ainda está em análise. Aguarde aprovação do administrador." }, 403);
    }
    if (user.status === "SUSPENSO") {
      return c.json({ error: "A sua conta foi suspensa. Contacte o administrador." }, 403);
    }

    // Verificar se assinatura expirou (check em tempo real)
    if (user.status === "APROVADO" && user.subscription_expires_at) {
      const now = new Date();
      const expiresAt = new Date(user.subscription_expires_at);
      if (now > expiresAt) {
        // Auto-suspender
        await db(c.env).query(
          `UPDATE users SET status = 'SUSPENSO', status_reason = 'Assinatura vencida',
           subscription_status = 'VENCIDO' WHERE id = $1`,
          [user.id]
        );
        return c.json({ error: "A sua assinatura expirou. Renove para continuar." }, 403);
      }
    }
    if (user.status === "RECUSADO") {
      return c.json({ error: "A sua conta foi recusada. Contacte o administrador." }, 403);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        storeId: user.store_id,
        province: user.province,
        municipality: user.municipality,
        address: user.address,
        status: user.status,
        statusReason: user.status_reason,
        mustChangePassword: await isDefaultPassword(user.password),
        subscription: {
          status: user.subscription_status,
          activatedAt: user.subscription_activated_at,
          expiresAt: user.subscription_expires_at,
          daysLeft: user.subscription_expires_at
            ? Math.ceil((new Date(user.subscription_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao fazer login." }, 500);
  }
});

// PUT /api/auth/change-password — Alterar palavra-passe
authRouter.put("/change-password", async (c) => {
  try {
    const { userId, newPassword } = await c.req.json();
    if (!userId || !newPassword || newPassword.length < 6) {
      return c.json({ error: "Dados inválidos. A senha deve ter pelo menos 6 caracteres." }, 400);
    }
    await db(c.env).query("UPDATE users SET password = $2 WHERE id = $1", [userId, await hashPassword(newPassword)]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao alterar a senha." }, 500);
  }
});

// POST /api/auth/admin-login — Entrar na administração (ex: lugares)
authRouter.post("/admin-login", async (c) => {
  try {
    const { phone, password } = await c.req.json();
    if (!phone || !password) return c.json({ error: "Dados inválidos." }, 400);
    const rows = (await db(c.env).query(
      "SELECT id, password FROM users WHERE phone=$1 AND phone='999999999' LIMIT 1",
      [phone]
    )) as any[];
    if (!rows.length) return c.json({ error: "Credenciais de administrador inválidas." }, 400);
    const admin = rows[0];
    if (!(await verifyPassword(admin.password, password)))
      return c.json({ error: "Credenciais de administrador inválidas." }, 400);
    if (typeof admin.password === "string" && !admin.password.startsWith("pbkdf2$")) {
      await db(c.env).query("UPDATE users SET password = $2 WHERE id = $1", [admin.id, await hashPassword(password)]);
    }
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao entrar." }, 500);
  }
});

// GET /api/auth/status/:id — Obter status atual do utilizador
authRouter.get("/status/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const rows = (await db(c.env).query(
      `SELECT id, name, phone, store_id as "storeId", province, municipality, address, status, status_reason as "statusReason"
       FROM users WHERE id = $1`,
      [id]
    )) as any[];
    if (!rows.length) {
      return c.json({ error: "Utilizador não encontrado" }, 404);
    }
    return c.json(rows[0]);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao carregar status do utilizador" }, 500);
  }
});

// POST /api/auth/link-store — Associar nova loja a utilizador existente
authRouter.post("/link-store", async (c) => {
  try {
    const body = (await c.req.json()) as any;
    const { userId, storeName, category, phone, province, municipality, address } = body;

    // Se userId não fornecido, procurar por phone + store_type
    let userIdToUse = userId;
    if (!userIdToUse && phone) {
      const storeType = storeTypeFromCategory(category);
      const userRows = (await db(c.env).query("SELECT id FROM users WHERE phone=$1 AND store_type=$2", [phone, storeType])) as any[];
      if (!userRows.length) {
        return c.json({ error: "Utilizador não encontrado." }, 404);
      }
      userIdToUse = userRows[0].id;
    }

    if (!userIdToUse) {
      return c.json({ error: "Dados inválidos." }, 400);
    }

    const { primary: normalizedCategory, all: normalizedCategories } = normalizeStoreCategories(body);
    const storeId = `loja-${Date.now()}`;

    // Criar nova loja vinculada ao utilizador
    const storeType = storeTypeFromCategoryShort(category);
    const linkCoverColor = coverColorFor(storeType);
    const linkCoverImage = coverImageFor(storeType);
    await db(c.env).query(
      `INSERT INTO stores (id, name, category, categories, address, phone, whatsapp, description, cover_color, cover_image, province, municipality, locality, store_type)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        storeId,
        storeName || "Minha Loja",
        normalizedCategory,
        normalizedCategories,
        address || "",
        phone || "",
        descriptionFor(storeType),
        linkCoverColor,
        linkCoverImage,
        province || "",
        municipality || "",
        body.locality || "",
        storeType,
      ]
    );

    // Atualizar utilizador com nova loja — nova loja exige nova aprovação
    await db(c.env).query(
      `UPDATE users SET store_id = $2, status = 'PENDENTE', status_reason = 'Nova loja aguarda aprovação' WHERE id = $1`,
      [userIdToUse, storeId]
    );

    // Buscar dados atualizados do utilizador
    const result = (await db(c.env).query(
      `SELECT id, name, phone, store_id as "storeId", province, municipality, address, status, status_reason as "statusReason"
       FROM users WHERE id = $1`,
      [userIdToUse]
    )) as any[];

    return c.json({
      success: true,
      user: result[0],
      storeId,
      message: "Loja associada com sucesso.",
    });
  } catch (err: any) {
    console.error("LINK STORE ERROR:", err?.message || err);
    return c.json({ error: err?.message || "Erro ao associar loja." }, 500);
  }
});

// PUT /api/auth/rename-store — Renomear loja do utilizador
authRouter.put("/rename-store", async (c) => {
  try {
    const { storeId, newName } = await c.req.json();
    if (!storeId || !newName) {
      return c.json({ error: "Dados inválidos." }, 400);
    }
    await db(c.env).query("UPDATE stores SET name = $2 WHERE id = $1", [storeId, newName]);
    return c.json({ success: true, message: "Loja renomeada com sucesso." });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao renomear loja." }, 500);
  }
});

// POST /api/auth/request-password-reset — Solicitar redefinição de senha
authRouter.post("/request-password-reset", async (c) => {
  try {
    const { phone, storeType } = await c.req.json();
    if (!phone) {
      return c.json({ error: "Telefone é obrigatório." }, 400);
    }
    const store_type = storeType || "collection";

    // Verificar se o utilizador existe
    const userRows = (await db(c.env).query("SELECT id FROM users WHERE phone = $1 AND store_type = $2", [
      phone,
      store_type,
    ])) as any[];
    if (!userRows.length) {
      return c.json({ error: "Utilizador não encontrado nesta plataforma." }, 404);
    }

    // Verificar se já existe pedido pendente
    const existing = (await db(c.env).query(
      "SELECT id FROM password_reset_requests WHERE phone = $1 AND store_type = $2 AND status = 'PENDENTE'",
      [phone, store_type]
    )) as any[];
    if (existing.length) {
      return c.json({ error: "Já existe um pedido pendente. Aguarde o administrador." }, 400);
    }

    await db(c.env).query("INSERT INTO password_reset_requests (user_id, phone, store_type) VALUES ($1, $2, $3)", [
      userRows[0].id,
      phone,
      store_type,
    ]);
    return c.json({ success: true, message: "Pedido enviado. Aguarde aprovação do administrador." });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao solicitar redefinição de senha." }, 500);
  }
});
