
import { pool } from "./pg.js";

export async function saveJournal(j) {
  await pool.query(
    `INSERT INTO journals(title, slug, url)
     VALUES($1,$2,$3)
     ON CONFLICT (slug) DO NOTHING`,
    [j.title, j.slug, j.url]
  );
}

export async function getAllJournals() {
  const { rows } = await pool.query(`SELECT * FROM journals ORDER BY title`);
  return rows;
}

export async function saveArticle(issueUrl, article) {
  await pool.query(
    `INSERT INTO articles(issue_url, title, url, pdf)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (url) DO NOTHING`,
    [issueUrl, article.title, article.url, article.pdf]
  );
}

export async function getAllArticles({ limit = 100, offset = 0, search = "" } = {}) {
  const { rows } = await pool.query(
    `SELECT
       a.id,
       a.title,
       a.url,
       a.pdf,
       j.title AS journal_title,
       j.slug  AS journal_slug
     FROM articles a
     LEFT JOIN journals j ON j.slug = a.issue_url
     WHERE ($1 = '' OR a.title ILIKE '%' || $1 || '%')
     ORDER BY a.id DESC
     LIMIT $2 OFFSET $3`,
    [search, limit, offset]
  );
  return rows;
}

export async function getJournalBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT * FROM journals WHERE slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

export async function getArticlesByJournalSlug(slug) {
  const { rows } = await pool.query(
    `SELECT title, url, pdf FROM articles
     WHERE issue_url = $1
     ORDER BY title`,
    [slug]
  );
  return rows;
}

export async function createUser({ name, email, passwordHash, avatar, country_city, academic_degree, academic_title, workplace, position, competence, interests, phone, additional_info, files }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, avatar, country_city, academic_degree, academic_title, workplace, position, competence, interests, phone, additional_info, files)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id, name, email, avatar, country_city, phone, created_at`,
    [name, email, passwordHash, avatar||null, country_city||null, academic_degree||null, academic_title||null, workplace||null, position||null, competence||null, interests||null, phone||null, additional_info||null, files||null]
  );
  return rows[0];
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function findOrCreateOAuthUser({ email, name, avatar }) {
  const existing = await getUserByEmail(email);
  if (existing) {
    const { password_hash, ...safe } = existing;
    return safe;
  }
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, avatar)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, avatar, created_at`,
    [name, email, avatar || null]
  );
  return rows[0];
}
