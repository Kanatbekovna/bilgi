import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../db/pg.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createMaterial(req, res) {
  const { title, description, type, keywords } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Макаланын аталышы милдеттүү" });
  }

  try {
    const pdfPath = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO materials (title, description, type, keywords, pdf_path, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, type, keywords, pdfPath, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAllMaterials(req, res) {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name AS author_name
       FROM materials m
       LEFT JOIN users u ON m.created_by = u.id
       ORDER BY m.created_at DESC`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteMaterial(req, res) {
  try {
    const result = await pool.query(
      "DELETE FROM materials WHERE id = $1 RETURNING id, pdf_path",
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Макала табылган жок" });
    }

    // PDF файлды дискten өчүр
    const pdfPath = result.rows[0].pdf_path;
    if (pdfPath) {
      const filePath = path.join(__dirname, "../../uploads", pdfPath);
      fs.unlink(filePath, () => {});
    }

    res.json({ message: "Макала өчүрүлдү" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateUserRole(req, res) {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Роль: user же admin болушу керек" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "Колдонуучу табылган жок" });
    }
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
