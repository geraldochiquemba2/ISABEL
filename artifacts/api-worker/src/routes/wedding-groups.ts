import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const weddingGroupsRouter = new Hono<{ Bindings: Env }>();

// GET /api/wedding-groups — Listar todos os grupos
weddingGroupsRouter.get("/", async (c) => {
  try {
    const rows = await db(c.env).query("SELECT * FROM wedding_groups ORDER BY number ASC");
    return c.json(rows);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar grupos" }, 500);
  }
});

// GET /api/wedding-groups/:id — Buscar um grupo
weddingGroupsRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const rows = (await db(c.env).query("SELECT * FROM wedding_groups WHERE id=$1", [id])) as any[];
    if (!rows.length) return c.json({ error: "Grupo não encontrado" }, 404);
    return c.json(rows[0]);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar grupo" }, 500);
  }
});

// POST /api/wedding-groups — Criar grupo
weddingGroupsRouter.post("/", async (c) => {
  try {
    const { id, number, title, intro, items, category, image } = await c.req.json();
    const groupId = id || `wg-${Date.now()}`;
    await db(c.env).query(
      `INSERT INTO wedding_groups (id, number, title, intro, items, category, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [groupId, number || "00", title, intro || "", items || [], category, image || null]
    );
    return c.json({ success: true, id: groupId });
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err.message || "Erro ao criar grupo" }, 500);
  }
});

// PUT /api/wedding-groups/:id — Atualizar grupo
weddingGroupsRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { number, title, intro, items, category, image } = await c.req.json();
    await db(c.env).query(
      `UPDATE wedding_groups SET number=$2, title=$3, intro=$4, items=$5, category=$6, image=$7 WHERE id=$1`,
      [id, number, title, intro, items || [], category, image || null]
    );
    return c.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err.message || "Erro ao atualizar grupo" }, 500);
  }
});

// DELETE /api/wedding-groups/:id — Eliminar grupo
weddingGroupsRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query("DELETE FROM wedding_groups WHERE id=$1", [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao eliminar grupo" }, 500);
  }
});
