// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// // Add a comment
// router.post("/", async (req, res) => {
//   const { user_id, message } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO comments (user_id, message) VALUES ($1,$2) RETURNING *",
//       [user_id, message]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all comments
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT comments.*, users.full_name FROM comments LEFT JOIN users ON comments.user_id = users.user_id ORDER BY comments.created_at DESC"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

// routes/comments.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// 🔹 Get all comments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.comment_id, c.content, c.created_at, u.full_name
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Get comments error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Post a new comment
router.post("/", async (req, res) => {
  try {
    const { user_id, content } = req.body;

    if (!user_id || !content.trim()) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    const result = await pool.query(
      `INSERT INTO comments (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Post comment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete a comment (optional, for admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM comments WHERE comment_id = $1", [id]);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
