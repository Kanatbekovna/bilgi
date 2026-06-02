import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../db/pg.js";
import { Request, Response } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createMaterial(req: Request, res: Response) {
  const { title, description, type, keywords } = req.body as any;

  if (!title) {
    return res.status(400).json({ error: "Заголовок статьи обязателен" });
  }

  try {
    const pdfPath = (req as any).file ? (req as any).file.filename : null;

    const result = await pool.query(
      `INSERT INTO materials (title, description, type, keywords, pdf_path, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, type, keywords, pdfPath, (req as any).user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAllMaterials(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name AS author_name
       FROM materials m
       LEFT JOIN users u ON m.created_by = u.id
       ORDER BY m.created_at DESC`
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteMaterial(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "DELETE FROM materials WHERE id = $1 RETURNING id, pdf_path",
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Статья не найдена" });
    }

    const pdfPath = result.rows[0].pdf_path;
    if (pdfPath) {
      const filePath = path.join(__dirname, "../../uploads", pdfPath);
      fs.unlink(filePath, () => {});
    }

    res.json({ message: "Статья удалена" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  const { role } = req.body as any;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Роль должна быть 'user' или 'admin'" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
