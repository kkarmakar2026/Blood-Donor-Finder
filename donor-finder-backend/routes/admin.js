import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAdminToken } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// ===========================
//  Admin Login
// ===========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const admin = result.rows[0];

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!process.env.ADMIN_JWT_SECRET) {
      throw new Error("ADMIN_JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
//  Admin Get All Users
// ===========================
router.get("/users", verifyAdminToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email, phone, whatsapp, country, state, district, city, blood_group, availability, role, created_at
       FROM users
       WHERE role='user'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Admin fetch users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
//  Admin Add New User
// ===========================
router.post("/users", verifyAdminToken, async (req, res) => {
  const {
    full_name,
    email,
    phone,
    whatsapp,
    country,
    state,
    district,
    city,
    blood_group,
    password,
    availability,
  } = req.body;

  if (!full_name || !email || !phone || !country || !state || !blood_group || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users 
       (full_name, email, phone, whatsapp, country, state, district, city, blood_group, password, availability, role) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'user') 
       RETURNING *`,
      [
        full_name,
        email,
        phone,
        whatsapp || null,
        country,
        state,
        district,
        city,
        blood_group,
        hashedPassword,
        availability ?? true,
      ]
    );

    return res.status(201).json({
      message: "User added successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Add user error:", err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Email or phone number already exists" });
    }

    return res.status(500).json({ error: "Failed to add user" });
  }
});

// ===========================
//  Admin Update User
// ===========================
router.put("/users/:id", verifyAdminToken, async (req, res) => {
  const user_id = req.params.id;
  const {
    full_name,
    email,
    phone,
    whatsapp,
    district,
    city,
    blood_group,
    availability,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET full_name=$1, email=$2, phone=$3, whatsapp=$4, district=$5, city=$6,
           blood_group=$7, availability=$8, updated_at=CURRENT_TIMESTAMP
       WHERE user_id=$9
       RETURNING *`,
      [
        full_name,
        email,
        phone,
        whatsapp || null,
        district,
        city,
        blood_group,
        availability,
        user_id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: result.rows[0],
      message: "User updated by admin successfully",
    });
  } catch (err) {
    console.error("Admin update user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
//  Admin Delete User
// ===========================
router.delete("/users/:id", verifyAdminToken, async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM users WHERE user_id=$1 RETURNING *", [user_id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
