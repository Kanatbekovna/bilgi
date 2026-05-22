import { pool } from "./pg.js";

export async function saveJournal(j) {
  await pool.query(
    `INSERT INTO journals(title, slug, url)
     VALUES($1,$2,$3)
     ON CONFLICT (slug) DO NOTHING`,
    [j.title, j.slug, j.url]
  );
}

export async function saveArticle(issueUrl, article) {
  await pool.query(
    `INSERT INTO articles(issue_url, title, url, pdf)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (url) DO NOTHING`,
    [issueUrl, title, url, pdf]
  );
}
