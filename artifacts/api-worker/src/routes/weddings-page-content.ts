import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const weddingsPageContentRouter = new Hono<{ Bindings: Env }>();

const defaultContent = {
  hero: {
    kicker: "Concierge de celebrações · Luanda e além",
    title: "O amor,",
    titleItalic: "bem celebrado.",
    subtitle: "Bem-vindos à Eliora Weddings — onde cada promessa encontra o cuidado, a beleza e a calma para se tornar memória.",
    ctaText: "Descobrir os serviços",
    image: "/weddings/eliora-hero-couple.jpg",
    imageAlt: "Casal a celebrar uma ocasião especial",
  },
  essence: {
    kicker: "A nossa essência",
    quote: "Há uma diferença entre organizar um evento e orquestrar uma experiência.",
    description: "Na Eliora, cuidamos do que se vê e do que se sente. Reunimos pessoas, talentos e detalhes com discrição, para que possam viver o que realmente importa: estar juntos.",
    image: "/weddings/eliora-bridal-portrait.jpg",
    imageAlt: "Retrato editorial de uma noiva",
    caption: "02 — Beleza & presença",
  },
  blocks: [
    {
      number: "01",
      caption: "Intenção & presença",
      image: "/weddings/eliora-hero-couple.jpg",
      imageAlt: "Casal a celebrar uma ocasião especial",
    },
    {
      number: "03",
      caption: "Espaço & celebração",
      image: "/weddings/eliora-reception.jpg",
      imageAlt: "Mesa de receção de casamento em branco e prata",
    },
    {
      number: "04",
      caption: "Detalhe & intenção",
      image: "/weddings/eliora-florals.jpg",
      imageAlt: "Flores brancas numa mesa de casamento",
    },
  ],
};

weddingsPageContentRouter.get("/", async (c) => {
  try {
    const rows = (await db(c.env).query(
      "SELECT content FROM weddings_page_content WHERE id = 'main'"
    )) as any[];
    if (rows.length > 0) {
      return c.json(rows[0].content);
    }
    return c.json(defaultContent);
  } catch (err: any) {
    console.error("Erro ao buscar weddings_page_content:", err.message);
    return c.json(defaultContent);
  }
});

weddingsPageContentRouter.put("/", async (c) => {
  try {
    const content = await c.req.json();
    await db(c.env).query(
      `INSERT INTO weddings_page_content (id, content, updated_at) VALUES ('main', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET content = $1, updated_at = NOW()`,
      [JSON.stringify(content)]
    );
    return c.json({ ok: true });
  } catch (err: any) {
    console.error("Erro ao guardar weddings_page_content:", err.message);
    return c.json({ error: err.message }, 500);
  }
});
