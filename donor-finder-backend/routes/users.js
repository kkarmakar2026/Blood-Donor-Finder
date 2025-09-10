// routes/users.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js"; // ✅ JWT verify

const router = express.Router();

/**
 * PUT /api/users/:id
 * Update profile (only logged-in user)
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user; // from JWT
    if (parseInt(id) !== user_id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { full_name, email, phone, city, blood_group } = req.body;

    // ✅ Check unique email
    if (email) {
      const emailCheck = await pool.query(
        "SELECT user_id FROM users WHERE email = $1 AND user_id <> $2",
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    // ✅ Check unique phone
    if (phone) {
      const phoneCheck = await pool.query(
        "SELECT user_id FROM users WHERE phone = $1 AND user_id <> $2",
        [phone, id]
      );
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({ error: "Phone already registered" });
      }
    }

    // ✅ Update users table
    const userUpdate = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           city = COALESCE($4, city)
       WHERE user_id = $5
       RETURNING user_id, full_name, email, phone, city`,
      [full_name, email, phone, city, id]
    );

    if (userUpdate.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Update donor blood group
    await pool.query(
      `UPDATE donors
       SET blood_group = COALESCE($1, blood_group)
       WHERE user_id = $2`,
      [blood_group, id]
    );

    res.json({ message: "Profile updated successfully", user: userUpdate.rows[0] });
  } catch (err) {
    console.error("PUT /api/users/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
