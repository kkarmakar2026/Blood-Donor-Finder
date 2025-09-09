// utils/hashAdmin.js
import bcrypt from "bcryptjs";
import pool from "../db.js";

const createAdmin = async () => {
  const email = "admin@example.com"; // change
  const password = "admin123";       // change

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await pool.query(
    "INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
    [email, hashedPassword]
  );

  console.log("✅ Admin created:", email);
  process.exit(0);
};

createAdmin();
