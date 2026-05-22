import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bilgi_project",
  password: "aseda2008",
  port: 5432,
});