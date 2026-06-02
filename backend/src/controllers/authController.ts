import bcrypt from "bcryptjs";
import { pool } from "../db/pg.js";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/tokens.js";

function refreshExpiresAt(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

async function saveRefreshToken(userId: number, token: string): Promise<void> {
  await pool.query(
    "UPDATE users SET refresh_token_hash = $1, refresh_token_expires = $2 WHERE id = $3",
    [hashToken(token), refreshExpiresAt(), userId]
  );
}

export async function register(req: Request, res: Response) {
  const {
    name,
    email,
    password,
    country_city,
    academic_degree,
    academic_title,
    workplace,
    position_status,
    academic_competencies,
    research_interests,
    phone,
    extra_info,
  } = req.body as any;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Заполните обязательные поля (name, email, password)" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Этот email уже зарегистрирован" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const profileFile = (req as any).file ? `/uploads/profiles/${(req as any).file.filename}` : null;
    const result = await pool.query(
      `INSERT INTO users (
        name, email, password, country_city, academic_degree, academic_title,
        workplace, position_status, academic_competencies, research_interests,
        phone, extra_info, profile_file_path
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id, name, email, role`,
      [
        name, email, hashed,
        country_city || null, academic_degree || null, academic_title || null,
        workplace || null, position_status || null, academic_competencies || null,
        research_interests || null, phone || null, extra_info || null, profileFile,
      ],
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    res.status(201).json({ accessToken, refreshToken, user });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as any;

  if (!email || !password) {
    return res.status(400).json({ error: "Введите email и пароль" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email или пароль неверны" });
    }

    const rt = generateRefreshToken();
    await saveRefreshToken(user.id, rt);

    res.json({
      accessToken: generateAccessToken(user),
      refreshToken: rt,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as any;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  try {
    const result = await pool.query(
      `SELECT id, email, role
       FROM users
       WHERE refresh_token_hash = $1 AND refresh_token_expires > NOW()`,
      [hashToken(refreshToken)]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ error: "Токен недействителен или просрочен" });
    }

    const user = result.rows[0];
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body as any;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  try {
    await pool.query(
      "UPDATE users SET refresh_token_hash = NULL, refresh_token_expires = NULL WHERE refresh_token_hash = $1",
      [hashToken(refreshToken)]
    );
    res.json({ message: "Выход выполнен" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, country_city, academic_degree, academic_title, workplace, position_status, academic_competencies, research_interests, phone, extra_info, profile_file_path, created_at FROM users WHERE id = $1",
      [(req as any).user.id],
    );
    if (!result.rows[0])
      return res.status(404).json({ error: "Пользователь не найден" });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteMe(req: Request, res: Response) {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [(req as any).user.id]);
    res.json({ message: "Аккаунт удалён" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateMe(req: Request, res: Response) {
  const {
    name,
    password,
    country_city,
    academic_degree,
    academic_title,
    workplace,
    position_status,
    academic_competencies,
    research_interests,
    phone,
    extra_info,
  } = req.body as any;

  try {
    const profileFile = (req as any).file ? `/uploads/profiles/${(req as any).file.filename}` : null;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        `UPDATE users SET
          name = $1, password = $2, country_city = $3, academic_degree = $4,
          academic_title = $5, workplace = $6, position_status = $7,
          academic_competencies = $8, research_interests = $9, phone = $10,
          extra_info = $11, profile_file_path = COALESCE($12, profile_file_path)
        WHERE id = $13`,
        [
          name, hashed, country_city || null, academic_degree || null,
          academic_title || null, workplace || null, position_status || null,
          academic_competencies || null, research_interests || null, phone || null,
          extra_info || null, profileFile, (req as any).user.id,
        ],
      );
    } else {
      await pool.query(
        `UPDATE users SET
          name = $1, country_city = $2, academic_degree = $3,
          academic_title = $4, workplace = $5, position_status = $6,
          academic_competencies = $7, research_interests = $8, phone = $9,
          extra_info = $10, profile_file_path = COALESCE($11, profile_file_path)
        WHERE id = $12`,
        [
          name, country_city || null, academic_degree || null,
          academic_title || null, workplace || null, position_status || null,
          academic_competencies || null, research_interests || null, phone || null,
          extra_info || null, profileFile, (req as any).user.id,
        ],
      );
    }

    const result = await pool.query(
      "SELECT id, name, email, role, country_city, academic_degree, academic_title, workplace, position_status, academic_competencies, research_interests, phone, extra_info, profile_file_path FROM users WHERE id = $1",
      [(req as any).user.id],
    );
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
