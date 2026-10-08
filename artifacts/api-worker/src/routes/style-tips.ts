import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const styleTipsRouter = new Hono<{ Bindings: Env }>();

// GET /api/style-tips — listar todas
styleTipsRouter.get("/", async (c) => {
  try {
    const rows = (await db(c.env).query(
      "SELECT * FROM style_tips ORDER BY id ASC"
    )) as any[];
    return c.json(
      rows.map((r) => ({
        ...r,
        dicas: Array.isArray(r.dicas) ? r.dicas : [],
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar dicas de estilo" }, 500);
  }
});

// POST /api/style-tips — criar
styleTipsRouter.post("/", async (c) => {
  try {
    const { titulo, descricao, imagem, dicas } = await c.req.json();
    const dicasArr = Array.isArray(dicas) ? dicas : [];
    const rows = (await db(c.env).query(
      `INSERT INTO style_tips (titulo, descricao, imagem, dicas)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descricao, imagem, dicasArr]
    )) as any[];
    return c.json(rows[0]);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao criar dica de estilo" }, 500);
  }
});

// PUT /api/style-tips/:id — atualizar
styleTipsRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { titulo, descricao, imagem, dicas } = await c.req.json();
    const dicasArr = Array.isArray(dicas) ? dicas : [];
    await db(c.env).query(
      `UPDATE style_tips SET titulo=$2, descricao=$3, imagem=$4, dicas=$5 WHERE id=$1`,
      [id, titulo, descricao, imagem, dicasArr]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar dica de estilo" }, 500);
  }
});

// DELETE /api/style-tips/:id — remover
styleTipsRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query("DELETE FROM style_tips WHERE id=$1", [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao remover dica de estilo" }, 500);
  }
});
