import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bilgi_project",
  password: "3689",
  port: 5432,
});