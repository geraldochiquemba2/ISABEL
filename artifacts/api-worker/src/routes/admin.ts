import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const adminRouter = new Hono<{ Bindings: Env }>();

// GET /api/admin/users — Listar utilizadores (filtro por store_type opcional)
adminRouter.get("/users", async (c) => {
  try {
    const store_type = c.req.query("store_type");
    let query = `SELECT u.id, u.name, u.phone, u.status, u.status_reason as "statusReason",
              u.province, u.municipality, u.address, u.store_id as "storeId", u.store_type as "storeType",
              s.name as "storeName", s.logo_url as "logoUrl", s.cover_image as "coverImage"
       FROM users u
       LEFT JOIN stores s ON s.id = u.store_id`;
    const params: unknown[] = [];
    if (store_type) {
      query += ` WHERE u.store_type = $1`;
      params.push(store_type);
    }
    query += ` ORDER BY u.created_at DESC`;
    const rows = await db(c.env).query(query, params);
    return c.json(rows);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar utilizadores" }, 500);
  }
});

// PUT /api/admin/users/:id/approve — Aprovar lojista + activar 30 dias de assinatura
adminRouter.put("/users/:id/approve", async (c) => {
  try {
    const id = c.req.param("id");
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "APROVADO", expires: expires.toISOString() };

    await db(c.env).query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = $2, subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    return c.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao aprovar utilizador" }, 500);
  }
});

// PUT /api/admin/users/:id/reject — Recusar lojista com motivo
adminRouter.put("/users/:id/reject", async (c) => {
  try {
    const id = c.req.param("id");
    const { reason } = await c.req.json();
    await db(c.env).query("UPDATE users SET status = 'RECUSADO', status_reason = $2 WHERE id = $1", [
      id,
      reason || "Dados insuficientes ou inválidos",
    ]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao recusar utilizador" }, 500);
  }
});

// PUT /api/admin/users/:id/suspend — Suspender conta aprovada
adminRouter.put("/users/:id/suspend", async (c) => {
  try {
    const id = c.req.param("id");
    const { reason } = await c.req.json();
    await db(c.env).query("UPDATE users SET status = 'SUSPENSO', status_reason = $2 WHERE id = $1", [
      id,
      reason || "Conta suspensa pelo administrador",
    ]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao suspender conta" }, 500);
  }
});

// PUT /api/admin/users/:id/reactivate — Reativar conta suspensa + renovar 30 dias
adminRouter.put("/users/:id/reactivate", async (c) => {
  try {
    const id = c.req.param("id");
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "RENOVADO", expires: expires.toISOString() };

    await db(c.env).query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = $2, subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    return c.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao reativar conta" }, 500);
  }
});

// DELETE /api/admin/users/:id/cancel — Cancelar conta/solicitação pendente
adminRouter.delete("/users/:id/cancel", async (c) => {
  try {
    const id = c.req.param("id");

    // Obter o store_id do utilizador primeiro
    const userRows = (await db(c.env).query("SELECT store_id FROM users WHERE id = $1", [id])) as any[];
    if (userRows.length > 0) {
      const storeId = userRows[0].store_id;

      // Eliminar utilizador
      await db(c.env).query("DELETE FROM users WHERE id = $1", [id]);

      // Eliminar loja correspondente
      if (storeId) {
        await db(c.env).query("DELETE FROM stores WHERE id = $1", [storeId]);
      }
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao cancelar solicitação" }, 500);
  }
});
// PUT /api/admin/users/:id/reset-password — Redefinir senha para o padrão
adminRouter.put("/users/:id/reset-password", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query("UPDATE users SET password = '123456789' WHERE id = $1", [id]);
    return c.json({ success: true, message: "Senha redefinida para 123456789" });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao redefinir senha" }, 500);
  }
});

// GET /api/admin/password-reset-requests — Listar pedidos de redefinição de senha
adminRouter.get("/password-reset-requests", async (c) => {
  try {
    const store_type = c.req.query("store_type");
    let query = `
      SELECT prr.id, prr.user_id as "userId", prr.phone, prr.store_type as "storeType",
             prr.status, prr.created_at as "createdAt",
             u.name as "userName", u.store_id as "storeId",
             s.name as "storeName"
      FROM password_reset_requests prr
      LEFT JOIN users u ON u.id = prr.user_id
      LEFT JOIN stores s ON s.id = u.store_id
    `;
    const params: unknown[] = [];
    if (store_type) {
      query += ` WHERE prr.store_type = $1`;
      params.push(store_type);
    }
    query += ` ORDER BY prr.created_at DESC`;
    const rows = await db(c.env).query(query, params);
    return c.json(rows);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar pedidos" }, 500);
  }
});

// PUT /api/admin/password-reset-requests/:id/approve — Aprovar pedido (redefine senha)
adminRouter.put("/password-reset-requests/:id/approve", async (c) => {
  try {
    const id = c.req.param("id");
    const rows = (await db(c.env).query("SELECT user_id FROM password_reset_requests WHERE id = $1", [id])) as any[];
    if (!rows.length) {
      return c.json({ error: "Pedido não encontrado" }, 404);
    }
    const userId = rows[0].user_id;
    await db(c.env).query("UPDATE users SET password = '123456789' WHERE id = $1", [userId]);
    await db(c.env).query("UPDATE password_reset_requests SET status = 'APROVADO' WHERE id = $1", [id]);
    return c.json({ success: true, message: "Senha redefinida para 123456789" });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao aprovar pedido" }, 500);
  }
});

// DELETE /api/admin/password-reset-requests/:id — Rejeitar/remover pedido
adminRouter.delete("/password-reset-requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query("UPDATE password_reset_requests SET status = 'RECUSADO' WHERE id = $1", [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao rejeitar pedido" }, 500);
  }
});

// POST /api/admin/users/:id/renew — Renovar assinatura por mais 30 dias
adminRouter.post("/users/:id/renew", async (c) => {
  try {
    const id = c.req.param("id");
    const userRows = (await db(c.env).query("SELECT subscription_expires_at FROM users WHERE id = $1", [id])) as any[];
    if (!userRows.length) {
      return c.json({ error: "Utilizador não encontrado" }, 404);
    }

    const now = new Date();
    const currentExpiry = userRows[0].subscription_expires_at;
    // Se ainda não expirou, adiciona 30 dias a partir da data de expiração actual
    const baseDate = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
    const expires = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalEntry = { date: now.toISOString(), action: "PAGO", expires: expires.toISOString() };

    await db(c.env).query(
      `UPDATE users SET status = 'APROVADO', status_reason = NULL,
       subscription_activated_at = COALESCE(subscription_activated_at, $2),
       subscription_expires_at = $3,
       subscription_status = 'ACTIVO',
       renewal_history = COALESCE(renewal_history, '[]'::jsonb) || $4::jsonb
       WHERE id = $1`,
      [id, now, expires, JSON.stringify(renewalEntry)]
    );
    return c.json({ success: true, subscription: { activatedAt: now, expiresAt: expires, status: "ACTIVO" } });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao renovar assinatura" }, 500);
  }
});

// GET /api/admin/subscriptions — Dashboard de assinaturas (todas as empresas)
adminRouter.get("/subscriptions", async (c) => {
  try {
    const store_type = c.req.query("store_type");
    const status = c.req.query("status");
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
    const params: unknown[] = [];
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
    const rows = (await db(c.env).query(query, params)) as any[];

    // Calcular status da assinatura em tempo real
    const now = new Date();
    const enriched = rows.map((row) => {
      const expiresAt = row.expiresAt ? new Date(row.expiresAt) : null;
      const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

      let computedStatus = row.subscriptionStatus || "INATIVO";
      if (row.status === "APROVADO" && expiresAt) {
        if (daysLeft! <= 0) {
          computedStatus = "VENCIDO";
        } else if (daysLeft! <= 5) {
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

    return c.json({ stores: enriched, summary });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar assinaturas" }, 500);
  }
});

// POST /api/admin/check-expired — Verificar e suspender assinaturas vencidas (cron manual)
adminRouter.post("/check-expired", async (c) => {
  try {
    const now = new Date();
    const rows = (await db(c.env).query(
      `UPDATE users SET status = 'SUSPENSO', status_reason = 'Assinatura vencida — renovação pendente',
       subscription_status = 'VENCIDO'
       WHERE status = 'APROVADO'
       AND subscription_expires_at IS NOT NULL
       AND subscription_expires_at < $1
       AND phone != '999999999'
       RETURNING id, name, phone`,
      [now]
    )) as any[];
    return c.json({
      success: true,
      suspended: rows.length,
      users: rows,
      message: `${rows.length} conta(s) suspensa(s) por assinatura vencida.`,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao verificar assinaturas vencidas" }, 500);
  }
});
