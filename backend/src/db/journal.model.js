import { pool } from "./pg.js";

export async function saveJournal(j) {
  await pool.query(
    `INSERT INTO journals(title, slug, url, source)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (slug) DO NOTHING`,
    [j.title, j.slug || null, j.url, j.source || "unknown"]
  );
}
