import { pool } from "../db/pg.js";

export async function getMaterials(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;
  const search = req.query.search?.trim() || "";

  try {
    const whereClause = search
      ? "WHERE title ILIKE $1 OR keywords ILIKE $1"
      : "";
    const params = search ? [`%${search}%`, limit, offset] : [limit, offset];
    const countParams = search ? [`%${search}%`] : [];

    const [dataResult, countResult] = await Promise.all([
      pool.query(
        `SELECT id, title, description, type, keywords, pdf_path, created_at
         FROM materials
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}`,
        params
      ),
      pool.query(
        `SELECT COUNT(*) FROM materials ${whereClause}`,
        countParams
      ),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMaterialById(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM materials WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Макала табылган жок" });
    }
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
