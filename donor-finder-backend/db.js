// db.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB connection error:", err);
  else console.log("DB connected at:", res.rows[0].now);
});

export default pool;
