import { pool } from "../db/pg.js";
import { Request, Response } from "express";

export async function getMaterials(req: Request, res: Response) {
  const page = Math.max(1, parseInt((req.query.page as string) || "1") || 1);
  const limit = Math.min(50, parseInt((req.query.limit as string) || "10") || 10);
  const offset = (page - 1) * limit;
  const search = (req.query.search as string)?.trim() || "";

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
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMaterialById(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT * FROM materials WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Статья не найдена" });
    }
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
