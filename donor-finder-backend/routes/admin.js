// // routes/admin.js
// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../db.js";

// const router = express.Router();

// // 🔹 Admin login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await pool.query("SELECT * FROM admins WHERE email=$1", [email]);
//     if (admin.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

//     const valid = await bcrypt.compare(password, admin.rows[0].password_hash);
//     if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ adminId: admin.rows[0].admin_id }, "secretkey", { expiresIn: "2h" });
//     res.json({ token });
//   } catch (err) {
//     console.error("Admin login error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🔹 Get all users
// router.get("/users", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users ORDER BY full_name ASC");
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Get users error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🔹 Delete user
// router.delete("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM donors WHERE user_id=$1", [id]);
//     await pool.query("DELETE FROM users WHERE user_id=$1", [id]);
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     console.error("Delete user error:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;


// routes/admin.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// 🔹 Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await pool.query("SELECT * FROM admins WHERE email=$1", [email]);
    if (admin.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.rows[0].password_hash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin.rows[0].admin_id }, "secretkey", { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get all users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY full_name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Add new user (by admin)
router.post("/users", async (req, res) => {
  try {
    const { full_name, email, password, phone, city, blood_group } = req.body;

    if (!full_name || !email || !password || !phone || !city || !blood_group) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check duplicates
    const emailCheck = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const phoneCheck = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
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

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Add user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM donors WHERE user_id=$1", [id]);
    await pool.query("DELETE FROM users WHERE user_id=$1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;



