import { Router } from "express";
import { pool } from "../db";

export const weddingGroupsRouter = Router();

// GET /api/wedding-groups — Listar todos os grupos
weddingGroupsRouter.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM wedding_groups ORDER BY number ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar grupos" });
  }
});

// GET /api/wedding-groups/:id — Buscar um grupo
weddingGroupsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM wedding_groups WHERE id=$1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Grupo não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar grupo" });
  }
});

// POST /api/wedding-groups — Criar grupo
weddingGroupsRouter.post("/", async (req, res) => {
  try {
    const { id, number, title, intro, items, category, image } = req.body;
    const groupId = id || `wg-${Date.now()}`;
    await pool.query(
      `INSERT INTO wedding_groups (id, number, title, intro, items, category, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [groupId, number || "00", title, intro || "", items || [], category, image || null]
    );
    res.json({ success: true, id: groupId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Erro ao criar grupo" });
  }
});

// PUT /api/wedding-groups/:id — Atualizar grupo
weddingGroupsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { number, title, intro, items, category, image } = req.body;
    await pool.query(
      `UPDATE wedding_groups SET number=$2, title=$3, intro=$4, items=$5, category=$6, image=$7 WHERE id=$1`,
      [id, number, title, intro, items || [], category, image || null]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Erro ao atualizar grupo" });
  }
});

// DELETE /api/wedding-groups/:id — Eliminar grupo
weddingGroupsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM wedding_groups WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao eliminar grupo" });
  }
});
