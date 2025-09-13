import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "../db.js";

dotenv.config();

async function createAdmin() {
  try {
    const name = process.env.ADMIN_NAME ?? "Admin";
    const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
    const plainPassword = process.env.ADMIN_PASSWORD ?? "admin123";

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const query = `
      INSERT INTO admins (name, email, password, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email)
      DO UPDATE SET 
        password = EXCLUDED.password,
        name = EXCLUDED.name
      RETURNING admin_id;
    `;

    const result = await pool.query(query, [name, email, passwordHash]);

    console.log("✅ Admin created/updated:", result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("createAdmin error:", err.message);
    process.exit(1);
  }
}

createAdmin();
