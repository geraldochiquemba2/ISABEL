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
    const { storeName, phone, password, category, province, municipality, address } = req.body;
    const normalizedCategory = normalizeCategory(category);
    
    // Verificar se número já existe
    const exists = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (exists.rows.length) {
      return res.status(400).json({ error: "Este número de telefone já está registado." });
    }

    // Criar uma nova loja automaticamente para este utilizador
    const storeId = `loja-${Date.now()}`;
    await pool.query(
      `INSERT INTO stores (id, name, category, address, phone, whatsapp, description, cover_color, cover_image, province, municipality)
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, $9, $10)`,
      [
        storeId,
        storeName || 'Minha Loja',
        normalizedCategory,
        address || '',
        phone || '',
        'A minha nova loja no GuiaLocal.',
        '#e8cfd9',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop&auto=format&q=80',
        province || '',
        municipality || ''
      ]
    );

    // Inserir Utilizador
    const result = await pool.query(
      `INSERT INTO users (name, phone, password, province, municipality, address, store_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDENTE') RETURNING id, name, phone, store_id, status, status_reason`,
      [storeName || 'Lojista', phone, password, province || '', municipality || '', address || '', storeId]
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
    const { phone, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (!result.rows.length) {
      return res.status(400).json({ error: "Telefone ou senha incorretos." });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(400).json({ error: "Telefone ou senha incorretos." });
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

