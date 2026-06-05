import { pool } from "./db.js";

async function run() {
  const client = await pool.connect();
  try {
    const images: Record<string, string> = {
      'moda': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80',
      'eletronicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&q=80',
      'alimentacao': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&q=80',
      'saude-beleza': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80',
      'servicos-residenciais': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80',
      'automotivo': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&q=80',
      'educacao': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80',
      'pets': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop&q=80'
    };

    for (const [id, url] of Object.entries(images)) {
      await client.query(`UPDATE categories SET cover_image = $1 WHERE id = $2 AND (cover_image IS NULL OR cover_image = '')`, [url, id]);
    }
    console.log("Categorias actualizadas com imagens padrão!");
  } finally {
    client.release();
    pool.end();
    process.exit(0);
  }
}

run().catch(console.error);
