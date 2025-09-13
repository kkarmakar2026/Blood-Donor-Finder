import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const saltRounds = 10;

// REGISTER (works for normal users; admins can also be created here if needed)
router.post("/register", async (req, res) => {
  const { full_name, email, phone, whatsapp, country, state, district, city, blood_group, password, role } = req.body;
  
  if (!full_name || !email || !phone || !country || !state || !blood_group || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check duplicates
    const e = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (e.rows.length) return res.status(400).json({ error: "Email already exists" });
    const p = await pool.query("SELECT 1 FROM users WHERE phone=$1", [phone]);
    if (p.rows.length) return res.status(400).json({ error: "Phone already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (full_name,email,phone,whatsapp,country,state,district,city,blood_group,password,role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING user_id, full_name, email, role`,
      [full_name, email, phone, whatsapp || null, country, state, district || null, city || null, blood_group, hashed, role || 'user']
    );

    res.status(201).json({ user: result.rows[0], message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN (works for both users and admins)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const r = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (r.rows.length === 0) return res.status(400).json({ error: "Invalid email or password" });

    const user = r.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });

    // Token secret based on role
    const isAdmin = user.role === "admin";
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET,
      { expiresIn: "1h" } // changed from 60s to 1 hour
    );

    res.json({
      token,
      user: { user_id: user.user_id, full_name: user.full_name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

