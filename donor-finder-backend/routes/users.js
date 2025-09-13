import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ===========================
// Register new user
// ===========================
router.post("/register", async (req, res) => {
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
       RETURNING user_id, full_name, email, phone`,
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

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === "23505") return res.status(400).json({ error: "Email or phone already exists" });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===========================
// Get current user's data
// ===========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const r = await pool.query(
      `SELECT user_id, full_name, email, phone, whatsapp, country, state, district, city, blood_group, availability, role
       FROM users WHERE user_id=$1`, [userId]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(r.rows[0]);
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
// Update own profile
// ===========================
router.put("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.user_id; // extracted from JWT
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
    availability,
  } = req.body;

  try {
    // check if email already used by another user
    const emailCheck = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 AND user_id != $2",
      [email, userId]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await pool.query(
      `UPDATE users 
       SET full_name=$1, email=$2, phone=$3, whatsapp=$4, 
           country=$5, state=$6, district=$7, city=$8, 
           blood_group=$9, availability=$10, updated_at=CURRENT_TIMESTAMP
       WHERE user_id=$11
       RETURNING user_id, full_name, email, phone, whatsapp, country, state, district, city, blood_group, availability`,
      [
        full_name, email, phone, whatsapp || null,
        country, state, district || null, city || null,
        blood_group, availability ?? true, userId
      ]
    );

    res.json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ===========================
// Search users by blood group & location
// ===========================
router.post("/search", async (req, res) => {
  const { blood_group, country, state, district, city } = req.body;

  try {
    const result = await pool.query(
      `SELECT user_id, full_name, blood_group, phone, whatsapp, district, city, state, country
       FROM users 
       WHERE blood_group ILIKE $1
         AND country ILIKE $2
         AND state ILIKE $3
         AND district ILIKE $4
         AND city ILIKE $5
         AND role='user'`,
      [
        blood_group?.trim() || "%",
        country?.trim() || "%",
        state?.trim() || "%",
        district?.trim() || "%",
        city?.trim() || "%",
      ]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
