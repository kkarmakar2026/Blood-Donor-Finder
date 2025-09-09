import express from "express";
import pool from "../db.js";

const router = express.Router();

// Add a comment
router.post("/", async (req, res) => {
  const { user_id, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO comments (user_id, message) VALUES ($1,$2) RETURNING *",
      [user_id, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all comments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT comments.*, users.full_name FROM comments LEFT JOIN users ON comments.user_id = users.user_id ORDER BY comments.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
