import { pool } from "./pg.js";

export async function saveArticle(source, article) {
  await pool.query(
    `INSERT INTO articles(source, issue_url, title, url, pdf)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (url) DO NOTHING`,
    [
      source,
      article.issueUrl || null,
      article.title,
      article.url,
      article.pdf || null,
    ]
  );
}
