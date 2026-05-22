import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pg.js";

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Бардык талааларды толтуруңуз" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Бул email катталып калган" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, hashed]
    );

    const user = result.rows[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email жана сыр сөздү киргизиңиз" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email же сыр сөз туура эмес" });
    }

    res.json({
      token: signToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMe(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Колдонуучу табылган жок" });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateMe(req, res) {
  const { name, password } = req.body;

  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET name = $1, password = $2 WHERE id = $3", [
        name,
        hashed,
        req.user.id,
      ]);
    } else {
      await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, req.user.id]);
    }

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteMe(req, res) {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.json({ message: "Аккаунт өчүрүлдү" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
