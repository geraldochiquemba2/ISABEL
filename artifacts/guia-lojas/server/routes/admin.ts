import { Router } from "express";
import { pool } from "../db";

export const adminRouter = Router();

// GET /api/admin/users — Listar utilizadores (filtro por store_type opcional)
adminRouter.get("/users", async (req, res) => {
  try {
    const { store_type } = req.query;
    let query = `SELECT u.id, u.name, u.phone, u.status, u.status_reason as "statusReason",
              u.province, u.municipality, u.address, u.store_id as "storeId", u.store_type as "storeType",
              s.name as "storeName", s.logo_url as "logoUrl", s.cover_image as "coverImage"
       FROM users u
       LEFT JOIN stores s ON s.id = u.store_id`;
    const params: any[] = [];
    if (store_type) {
      query += ` WHERE u.store_type = $1`;
      params.push(store_type);
    }
    query += ` ORDER BY u.created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar utilizadores" });
  }
});

// PUT /api/admin/users/:id/approve — Aprovar lojista + activar 30 dias de assinatura
adminRouter.put("/users/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "APROVADO", expires: expires.toISOString() };

    await pool.query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = $2, subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    res.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao aprovar utilizador" });
  }
});

// PUT /api/admin/users/:id/reject — Recusar lojista com motivo
adminRouter.put("/users/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await pool.query(
      "UPDATE users SET status = 'RECUSADO', status_reason = $2 WHERE id = $1",
      [id, reason || "Dados insuficientes ou inválidos"]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao recusar utilizador" });
  }
});

// PUT /api/admin/users/:id/suspend — Suspender conta aprovada
adminRouter.put("/users/:id/suspend", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await pool.query(
      "UPDATE users SET status = 'SUSPENSO', status_reason = $2 WHERE id = $1",
      [id, reason || "Conta suspensa pelo administrador"]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao suspender conta" });
  }
});

// PUT /api/admin/users/:id/reactivate — Reativar conta suspensa + renovar 30 dias
adminRouter.put("/users/:id/reactivate", async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "RENOVADO", expires: expires.toISOString() };

    await pool.query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = $2, subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    res.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao reativar conta" });
  }
});

// DELETE /api/admin/users/:id/cancel — Cancelar conta/solicitação pendente
adminRouter.delete("/users/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obter o store_id do utilizador primeiro
    const userRes = await pool.query("SELECT store_id FROM users WHERE id = $1", [id]);
    if (userRes.rows.length > 0) {
      const storeId = userRes.rows[0].store_id;
      
      // Eliminar utilizador
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      
      // Eliminar loja correspondente
      if (storeId) {
        await pool.query("DELETE FROM stores WHERE id = $1", [storeId]);
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cancelar solicitação" });
  }
});
// PUT /api/admin/users/:id/reset-password — Redefinir senha para o padrão
adminRouter.put("/users/:id/reset-password", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE users SET password = '123456789' WHERE id = $1",
      [id]
    );
    res.json({ success: true, message: "Senha redefinida para 123456789" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao redefinir senha" });
  }
});

// GET /api/admin/password-reset-requests — Listar pedidos de redefinição de senha
adminRouter.get("/password-reset-requests", async (req, res) => {
  try {
    const { store_type } = req.query;
    let query = `
      SELECT prr.id, prr.user_id as "userId", prr.phone, prr.store_type as "storeType",
             prr.status, prr.created_at as "createdAt",
             u.name as "userName", u.store_id as "storeId",
             s.name as "storeName"
      FROM password_reset_requests prr
      LEFT JOIN users u ON u.id = prr.user_id
      LEFT JOIN stores s ON s.id = u.store_id
    `;
    const params: any[] = [];
    if (store_type) {
      query += ` WHERE prr.store_type = $1`;
      params.push(store_type);
    }
    query += ` ORDER BY prr.created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// PUT /api/admin/password-reset-requests/:id/approve — Aprovar pedido (redefine senha)
adminRouter.put("/password-reset-requests/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await pool.query("SELECT user_id FROM password_reset_requests WHERE id = $1", [id]);
    if (!request.rows.length) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    const userId = request.rows[0].user_id;
    await pool.query("UPDATE users SET password = '123456789' WHERE id = $1", [userId]);
    await pool.query("UPDATE password_reset_requests SET status = 'APROVADO' WHERE id = $1", [id]);
    res.json({ success: true, message: "Senha redefinida para 123456789" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao aprovar pedido" });
  }
});

// DELETE /api/admin/password-reset-requests/:id — Rejeitar/remover pedido
adminRouter.delete("/password-reset-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE password_reset_requests SET status = 'RECUSADO' WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao rejeitar pedido" });
  }
});

// POST /api/admin/users/:id/renew — Renovar assinatura por mais 30 dias
adminRouter.post("/users/:id/renew", async (req, res) => {
  try {
    const { id } = req.params;
    const userRes = await pool.query("SELECT subscription_expires_at FROM users WHERE id = $1", [id]);
    if (!userRes.rows.length) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    const now = new Date();
    const currentExpiry = userRes.rows[0].subscription_expires_at;
    // Se ainda não expirou, adiciona 30 dias a partir da data de expiração actual
    const baseDate = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
    const expires = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "PAGO", expires: expires.toISOString() };

    await pool.query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = COALESCE(subscription_activated_at, $2),
       subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    res.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao renovar assinatura" });
  }
});

// GET /api/admin/subscriptions — Dashboard de assinaturas (todas as empresas)
adminRouter.get("/subscriptions", async (req, res) => {
  try {
    const { store_type, status } = req.query;
    let query = `
      SELECT u.id, u.name, u.phone, u.status, u.store_type as "storeType",
             u.subscription_activated_at as "activatedAt",
             u.subscription_expires_at as "expiresAt",
             u.subscription_status as "subscriptionStatus",
             u.renewal_history as "renewalHistory",
             u.created_at as "createdAt",
             s.name as "storeName", s.id as "storeId"
      FROM users u
      LEFT JOIN stores s ON s.id = u.store_id
      WHERE u.phone != '999999999'
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (store_type) {
      query += ` AND u.store_type = $${paramIdx++}`;
      params.push(store_type);
    }
    if (status) {
      query += ` AND u.status = $${paramIdx++}`;
      params.push(status);
    }

    query += ` ORDER BY u.created_at DESC`;
    const result = await pool.query(query, params);

    // Calcular status da assinatura em tempo real
    const now = new Date();
    const enriched = result.rows.map((row) => {
      const expiresAt = row.expiresAt ? new Date(row.expiresAt) : null;
      const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      let computedStatus = row.subscriptionStatus || "INATIVO";
      if (row.status === "APROVADO" && expiresAt) {
        if (daysLeft <= 0) {
          computedStatus = "VENCIDO";
        } else if (daysLeft <= 5) {
          computedStatus = "A_VENCER";
        } else {
          computedStatus = "ACTIVO";
        }
      } else if (row.status === "SUSPENSO") {
        computedStatus = "SUSPENSO";
      } else if (row.status === "PENDENTE") {
        computedStatus = "PENDENTE";
      }

      return {
        ...row,
        computedStatus,
        daysLeft,
      };
    });

    // Resumo
    const summary = {
      total: enriched.length,
      active: enriched.filter((r) => r.computedStatus === "ACTIVO").length,
      expiring: enriched.filter((r) => r.computedStatus === "A_VENCER").length,
      expired: enriched.filter((r) => r.computedStatus === "VENCIDO").length,
      suspended: enriched.filter((r) => r.computedStatus === "SUSPENSO").length,
      pending: enriched.filter((r) => r.computedStatus === "PENDENTE").length,
    };

    res.json({ stores: enriched, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar assinaturas" });
  }
});

// POST /api/admin/check-expired — Verificar e suspender assinaturas vencidas (cron manual)
adminRouter.post("/check-expired", async (req, res) => {
  try {
    const now = new Date();
    const result = await pool.query(
      `UPDATE users SET status = 'SUSPENSO', status_reason = 'Assinatura vencida — renovação pendente',
       subscription_status = 'VENCIDO'
       WHERE status = 'APROVADO'
       AND subscription_expires_at IS NOT NULL
       AND subscription_expires_at < $1
       AND phone != '999999999'
       RETURNING id, name, phone`,
      [now]
    );
    res.json({
      success: true,
      suspended: result.rowCount,
      users: result.rows,
      message: `${result.rowCount} conta(s) suspensa(s) por assinatura vencida.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao verificar assinaturas vencidas" });
  }
});

