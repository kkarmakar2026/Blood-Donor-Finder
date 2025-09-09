import express from "express";
import pool from "../db.js"; // PostgreSQL pool
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "supersecretkey"; // ✅ Replace with env variable in production

// -----------------------
// REGISTER USER
// -----------------------
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, phone, city, blood_group } = req.body;

    if (!full_name || !email || !password || !phone || !city || !blood_group) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    // ✅ Check if phone number already exists
    const phoneCheck = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into users table
    const newUserRes = await pool.query(
      `INSERT INTO users (full_name, email, password, phone, city, blood_group)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, hashedPassword, phone, city, blood_group]
    );

    const newUser = newUserRes.rows[0];

    // Insert into donors table (default availability = true)
    await pool.query(
      `INSERT INTO donors (user_id, blood_group, availability, last_donation)
       VALUES ($1, $2, TRUE, NULL)`,
      [newUser.user_id, blood_group]
    );

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// LOGIN USER
// -----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------
// UPDATE BLOOD GROUP
// -----------------------
router.post("/update-blood-group", async (req, res) => {
  try {
    const { email, blood_group } = req.body;

    if (!email || !blood_group) {
      return res.status(400).json({ error: "Email and blood group are required" });
    }

    // Check if user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    // Update both users + donors table
    await pool.query("UPDATE users SET blood_group = $1 WHERE email = $2", [blood_group, email]);
    await pool.query("UPDATE donors SET blood_group = $1 WHERE user_id = $2", [
      blood_group,
      userCheck.rows[0].user_id,
    ]);

    res.json({ message: "Blood group updated successfully" });
  } catch (err) {
    console.error("Update blood group error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
