import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const placesRouter = new Hono<{ Bindings: Env }>();

// GET /api/places — listar lugares (igrejas e serviços públicos)
// Filtros: kind (igreja | servico-publico), province, municipality, q
placesRouter.get("/", async (c) => {
  try {
    const kind = c.req.query("kind");
    const province = c.req.query("province");
    const municipality = c.req.query("municipality");
    const q = c.req.query("q");
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (kind) {
      params.push(kind);
      conditions.push(`kind = $${params.length}`);
    }
    if (province) {
      params.push(province);
      conditions.push(`province = $${params.length}`);
    }
    if (municipality) {
      params.push(municipality);
      conditions.push(`municipality = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(name ILIKE $${params.length} OR category ILIKE $${params.length} OR address ILIKE $${params.length})`);
    }

    let query = `SELECT id, name, kind, category, address, province, municipality, locality,
      latitude, longitude, phone, source, osm_id as "osmId", created_at as "createdAt" FROM places`;
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY name ASC LIMIT 500";

    const rows = (await db(c.env).query(query, params)) as any[];
    return c.json(
      rows.map((r) => ({
        ...r,
        latitude: r.latitude != null ? parseFloat(String(r.latitude)) : null,
        longitude: r.longitude != null ? parseFloat(String(r.longitude)) : null,
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar lugares" }, 500);
  }
});

// POST /api/places — cadastro manual (admin)
placesRouter.post("/", async (c) => {
  try {
    const body = (await c.req.json()) as any;
    const { name, kind, category, address, province, municipality, locality, latitude, longitude, phone } = body;
    if (!name || !String(name).trim()) return c.json({ error: "Nome é obrigatório." }, 400);
    if (kind && !["igreja", "servico-publico"].includes(kind))
      return c.json({ error: "Tipo inválido." }, 400);
    const source = body.source === "comunidade" ? "comunidade" : "manual";
    const rows = (await db(c.env).query(
      `INSERT INTO places (name, kind, category, address, province, municipality, locality, latitude, longitude, phone, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [String(name).trim(), kind || "igreja", category || "", address || "", province || "", municipality || "", locality || "", latitude || null, longitude || null, phone || "", source]
    )) as any[];
    return c.json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao criar lugar" }, 500);
  }
});

// PUT /api/places/:id — atualizar (admin)
placesRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { name, kind, category, address, province, municipality, locality, latitude, longitude, phone } =
      await c.req.json();
    if (!name || !String(name).trim()) return c.json({ error: "Nome é obrigatório." }, 400);
    await db(c.env).query(
      `UPDATE places SET name=$2, kind=$3, category=$4, address=$5, province=$6, municipality=$7,
       locality=$8, latitude=$9, longitude=$10, phone=$11 WHERE id=$1`,
      [id, String(name).trim(), kind || "igreja", category || "", address || "", province || "", municipality || "", locality || "", latitude || null, longitude || null, phone || ""]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar lugar" }, 500);
  }
});

// DELETE /api/places/:id — remover (admin)
placesRouter.delete("/:id", async (c) => {
  try {
    await db(c.env).query("DELETE FROM places WHERE id = $1", [c.req.param("id")]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao remover lugar" }, 500);
  }
});

// Mapeamento OSM amenity -> { kind, category }
const OSM_MAP: Record<string, { kind: string; category: string }> = {
  place_of_worship: { kind: "igreja", category: "Igreja" },
  hospital: { kind: "servico-publico", category: "Saúde" },
  clinic: { kind: "servico-publico", category: "Saúde" },
  pharmacy: { kind: "servico-publico", category: "Saúde" },
  doctors: { kind: "servico-publico", category: "Saúde" },
  police: { kind: "servico-publico", category: "Segurança" },
  post_office: { kind: "servico-publico", category: "Correios" },
  townhall: { kind: "servico-publico", category: "Administração" },
  public_building: { kind: "servico-publico", category: "Administração" },
  school: { kind: "servico-publico", category: "Educação" },
  university: { kind: "servico-publico", category: "Educação" },
  kindergarten: { kind: "servico-publico", category: "Educação" },
};

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// POST /api/places/import — importar do OpenStreetMap (admin)
// body: { minLat, minLon, maxLat, maxLon, amenities?: string[] }
placesRouter.post("/import", async (c) => {
  try {
    const { minLat, minLon, maxLat, maxLon, amenities } = await c.req.json();
    const nums = [minLat, minLon, maxLat, maxLon].map(Number);
    if (nums.some((n) => !isFinite(n))) return c.json({ error: "Bbox inválida." }, 400);
    const [s, w, n, e] = nums;
    if (s >= n || w >= e) return c.json({ error: "Bbox inválida." }, 400);

    const wanted = Array.isArray(amenities) && amenities.length ? amenities : Object.keys(OSM_MAP);
    const filters = wanted
      .filter((a) => OSM_MAP[a])
      .map((a) => {
        if (a === "place_of_worship") return `nwr["amenity"="place_of_worship"]["religion"="christian"](${s},${w},${n},${e});`;
        return `nwr["amenity"="${a}"](${s},${w},${n},${e});`;
      })
      .join("");
    if (!filters) return c.json({ error: "Nenhuma categoria válida." }, 400);

    const ql = `[out:json][timeout:60];(${filters});out center 500;`;
    let data: any = null;
    let lastErr = "";
    for (const url of OVERPASS_URLS) {
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "data=" + encodeURIComponent(ql),
        });
        if (!r.ok) {
          lastErr = `Overpass ${r.status}`;
          continue;
        }
        data = await r.json();
        break;
      } catch (err: any) {
        lastErr = err?.message || "falha de rede";
      }
    }
    if (!data) return c.json({ error: "Overpass indisponível: " + lastErr }, 502);

    // Batch em multi-row (no Workers cada query HTTP é um roundtrip: 1 a 1
    // com centenas de elementos estourava o tempo da request).
    const values: unknown[] = [];
    const placeholders: string[] = [];
    let imported = 0,
      skipped = 0;
    const flush = async () => {
      if (!placeholders.length) return;
      try {
        await db(c.env).query(
          `INSERT INTO places (name, kind, category, address, latitude, longitude, phone, source, osm_id)
           VALUES ${placeholders.join(",")} ON CONFLICT (osm_id) DO NOTHING`,
          values
        );
      } catch {
        skipped += placeholders.length;
        imported -= placeholders.length;
      }
      placeholders.length = 0;
      values.length = 0;
    };
    for (const el of data.elements || []) {
      const amenity = el.tags?.amenity;
      const mapped = OSM_MAP[amenity];
      if (!mapped) {
        skipped++;
        continue;
      }
      const osmId = `${el.type}/${el.id}`;
      const lat = el.lat ?? el.center?.lat ?? null;
      const lon = el.lon ?? el.center?.lon ?? null;
      const name = el.tags?.name || `${mapped.category} (sem nome)`;
      const street = [el.tags?.["addr:street"], el.tags?.["addr:housenumber"]].filter(Boolean).join(", ");
      const category =
        amenity === "place_of_worship" && el.tags?.denomination
          ? `Igreja — ${el.tags.denomination}`
          : mapped.category;
      const base = values.length;
      placeholders.push(
        `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},'osm',$${base + 8})`
      );
      values.push(name, mapped.kind, category, street, lat, lon, el.tags?.phone || "", osmId);
      imported++;
      if (placeholders.length >= 100) await flush();
    }
    await flush();
    return c.json({ success: true, imported, skipped, total: (data.elements || []).length });
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err?.message || "Erro na importação" }, 500);
  }
});
