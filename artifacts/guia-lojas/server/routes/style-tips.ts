import { Router } from "express";
import { pool } from "../db";

export const styleTipsRouter = Router();

// GET /api/style-tips — listar todas
styleTipsRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM style_tips ORDER BY id ASC"
    );
    res.json(result.rows.map(r => ({
      ...r,
      dicas: Array.isArray(r.dicas) ? r.dicas : []
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dicas de estilo" });
  }
});

// POST /api/style-tips — criar
styleTipsRouter.post("/", async (req, res) => {
  try {
    const { titulo, descricao, imagem, dicas } = req.body;
    const dicasArr = Array.isArray(dicas) ? dicas : [];
    const result = await pool.query(
      `INSERT INTO style_tips (titulo, descricao, imagem, dicas) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, imagem, dicasArr]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar dica de estilo" });
  }
});

// PUT /api/style-tips/:id — atualizar
styleTipsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, imagem, dicas } = req.body;
    const dicasArr = Array.isArray(dicas) ? dicas : [];
    await pool.query(
      `UPDATE style_tips SET titulo=$2, descricao=$3, imagem=$4, dicas=$5 WHERE id=$1`,
      [id, titulo, descricao, imagem, dicasArr]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar dica de estilo" });
  }
});

// DELETE /api/style-tips/:id — remover
styleTipsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM style_tips WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover dica de estilo" });
  }
});
