import { Router } from "express";
import { pool } from "../db";

const CATEGORY_LABELS: Record<string, string> = {
  moda: "Moda",
  eletronicos: "Eletrônicos",
  alimentacao: "Alimentação",
  "saude-beleza": "Saúde & Beleza",
  "saúde-beleza": "Saúde & Beleza",
  "servicos-residenciais": "Serviços Residenciais",
  servicos: "Serviços Residenciais",
  serviços: "Serviços Residenciais",
  automotivo: "Automotivo",
  motores: "Automotivo",
  "auto motores": "Automotivo",
  "auto-motores": "Automotivo",
  educacao: "Educação",
  pets: "Pets",
};

function normalizeCategory(category?: string) {
  if (!category) return "Geral";
  const normalized = category.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] || category;
}

export const authRouter = Router();

// POST /api/auth/register — Registo do Lojista
authRouter.post("/register", async (req, res) => {
  try {
    const { storeName, phone, password, category, province, municipality, address, storeType: storeTypeFromClient } = req.body;
    const normalizedCategory = normalizeCategory(category);
    const storeType = storeTypeFromClient || (category?.toLowerCase().includes("wedding") ? "weddings" : "collection");
    
    // Verificar se número já existe NESTE store_type
    const exists = await pool.query("SELECT * FROM users WHERE phone=$1 AND store_type=$2", [phone, storeType]);
    if (exists.rows.length) {
      return res.status(400).json({ error: "Este número de telefone já está registado nesta plataforma." });
    }

    // Criar uma nova loja automaticamente para este utilizador
    const storeId = `loja-${Date.now()}`;
    const isWeddings = storeType === "weddings";
    const isLove = storeType === "love-services";
    const isBusiness = storeType === "business";
    const isFormacoes = storeType === "formacoes";
    const isEventos = storeType === "eventos";
    const description = isLove
      ? "A minha loja na Eliora Love Services."
      : isWeddings
      ? 'A minha nova loja na Eliora Weddings.'
      : isBusiness
      ? 'A minha loja na Eliora Business & Finances.'
      : isFormacoes
      ? 'A minha loja na Eliora Formações.'
      : isEventos
      ? 'A minha loja na Eliora Eventos & Celebrações.'
      : 'A minha loja na Eliora Collection.';
    const coverColor = isLove ? '#d96f5c' : isBusiness ? '#112844' : isFormacoes ? '#087a76' : isEventos ? '#ad696b' : '#e8cfd9';
    const coverImage = isLove
      ? 'https://images.unsplash.com/photo-1529603095155-15342c491f1a?w=800&h=500&fit=crop&auto=format&q=80'
      : isWeddings
      ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format&q=80'
      : isBusiness
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop&auto=format&q=80'
      : isFormacoes
      ? 'https://images.unsplash.com/photo-1524178232363-6fb168ff49fe?w=800&h=500&fit=crop&auto=format&q=80'
      : isEventos
      ? 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=500&fit=crop&auto=format&q=80'
      : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&auto=format&q=80';

    await pool.query(
      `INSERT INTO stores (id, name, category, address, phone, whatsapp, description, cover_color, cover_image, province, municipality, store_type)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10, $11)`,
      [
        storeId,
        storeName || 'Minha Loja',
        normalizedCategory,
        address || '',
        phone || '',
        description,
        coverColor,
        coverImage,
        province || '',
        municipality || '',
        storeType,
      ]
    );

    // Inserir Utilizador
    const result = await pool.query(
      `INSERT INTO users (name, phone, password, province, municipality, address, store_id, store_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDENTE') RETURNING id, name, phone, store_id, status, status_reason`,
      [storeName || 'Lojista', phone, password, province || '', municipality || '', address || '', storeId, storeType]
    );

    const created = result.rows[0];
    res.json({
      success: true,
      user: {
        id: created.id,
        name: created.name,
        phone: created.phone,
        storeId: created.store_id,
        status: created.status,
        statusReason: created.status_reason,
      }
    });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err?.message || err);
    res.status(500).json({ error: err?.message || "Erro ao criar conta." });
  }
});

// POST /api/auth/login — Login do Lojista
authRouter.post("/login", async (req, res) => {
  try {
    const { phone, password, storeType } = req.body;
    const store_type = storeType || 'collection';
    const result = await pool.query("SELECT * FROM users WHERE phone=$1 AND store_type=$2", [phone, store_type]);
    if (!result.rows.length) {
      return res.status(400).json({ error: "Telefone ou senha incorretos." });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(400).json({ error: "Telefone ou senha incorretos." });
    }
    if (user.status === "PENDENTE") {
      return res.status(403).json({ error: "A sua conta ainda está em análise. Aguarde aprovação do administrador." });
    }
    if (user.status === "SUSPENSO") {
      return res.status(403).json({ error: "A sua conta foi suspensa. Contacte o administrador." });
    }
    if (user.status === "RECUSADO") {
      return res.status(403).json({ error: "A sua conta foi recusada. Contacte o administrador." });
    }

    res.json({
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
        mustChangePassword: user.password === "123456789",
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

// PUT /api/auth/change-password — Alterar palavra-passe
authRouter.put("/change-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Dados inválidos. A senha deve ter pelo menos 6 caracteres." });
    }
    await pool.query("UPDATE users SET password = $2 WHERE id = $1", [userId, newPassword]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao alterar a senha." });
  }
});

// GET /api/auth/status/:id — Obter status atual do utilizador
authRouter.get("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, phone, store_id as "storeId", province, municipality, address, status, status_reason as "statusReason"
       FROM users WHERE id = $1`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar status do utilizador" });
  }
});

// POST /api/auth/link-store — Associar nova loja a utilizador existente
authRouter.post("/link-store", async (req, res) => {
  try {
    const { userId, storeName, category, phone, province, municipality, address } = req.body;
    
    // Se userId não fornecido, procurar por phone + store_type
    let userIdToUse = userId;
    if (!userIdToUse && phone) {
      const storeType = category?.toLowerCase().includes("wedding") ? "weddings" : category?.toLowerCase().includes("love") ? "love-services" : "collection";
      const userResult = await pool.query("SELECT id FROM users WHERE phone=$1 AND store_type=$2", [phone, storeType]);
      if (!userResult.rows.length) {
        return res.status(404).json({ error: "Utilizador não encontrado." });
      }
      userIdToUse = userResult.rows[0].id;
    }
    
    if (!userIdToUse) {
      return res.status(400).json({ error: "Dados inválidos." });
    }

    const normalizedCategory = normalizeCategory(category);
    const storeId = `loja-${Date.now()}`;
    
    // Criar nova loja vinculada ao utilizador
    const storeType = category?.toLowerCase().includes("wedding") ? "weddings" : "collection";
    await pool.query(
      `INSERT INTO stores (id, name, category, address, phone, whatsapp, description, cover_color, cover_image, province, municipality, store_type)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10, $11)`,
      [
        storeId,
        storeName || 'Eliora Weddings',
        normalizedCategory,
        address || '',
        phone || '',
        isWeddings ? 'A minha nova loja na Eliora Weddings.' : 'A minha loja na Eliora Collection.',
        '#e8cfd9',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format&q=80',
        province || '',
        municipality || '',
        storeType,
      ]
    );

    // Atualizar utilizador com nova loja
    await pool.query(
      `UPDATE users SET store_id = $2 WHERE id = $1`,
      [userIdToUse, storeId]
    );

    // Buscar dados atualizados do utilizador
    const result = await pool.query(
      `SELECT id, name, phone, store_id as "storeId", province, municipality, address, status, status_reason as "statusReason"
       FROM users WHERE id = $1`,
      [userIdToUse]
    );

    res.json({
      success: true,
      user: result.rows[0],
      storeId,
      message: "Loja associada com sucesso."
    });
  } catch (err: any) {
    console.error("LINK STORE ERROR:", err?.message || err);
    res.status(500).json({ error: err?.message || "Erro ao associar loja." });
  }
});

// PUT /api/auth/rename-store — Renomear loja do utilizador
authRouter.put("/rename-store", async (req, res) => {
  try {
    const { storeId, newName } = req.body;
    if (!storeId || !newName) {
      return res.status(400).json({ error: "Dados inválidos." });
    }
    await pool.query("UPDATE stores SET name = $2 WHERE id = $1", [storeId, newName]);
    res.json({ success: true, message: "Loja renomeada com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao renomear loja." });
  }
});

