import { Router } from "express";
import { pool } from "../db";

export const adminRouter = Router();

// GET /api/admin/users — Listar todos os utilizadores
adminRouter.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.phone, u.status, u.status_reason as "statusReason",
              u.province, u.municipality, u.address, u.store_id as "storeId",
              s.name as "storeName", s.logo_url as "logoUrl", s.cover_image as "coverImage"
       FROM users u
       LEFT JOIN stores s ON s.id = u.store_id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar utilizadores" });
  }
});

// PUT /api/admin/users/:id/approve — Aprovar lojista
adminRouter.put("/users/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE users SET status = 'APROVADO', status_reason = NULL WHERE id = $1",
      [id]
    );
    res.json({ success: true });
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

// PUT /api/admin/users/:id/reactivate — Reativar conta suspensa
adminRouter.put("/users/:id/reactivate", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE users SET status = 'APROVADO', status_reason = NULL WHERE id = $1",
      [id]
    );
    res.json({ success: true });
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

