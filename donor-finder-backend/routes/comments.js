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


import express from "express";
import pool from "../db.js";

const router = express.Router();

// Add a comment
router.post("/", async (req, res) => {
  const { user_id, name, content } = req.body;

  try {
    let result;
    if (user_id) {
      // Registered user
      result = await pool.query(
        "INSERT INTO comments (user_id, content, created_at) VALUES ($1,$2,NOW()) RETURNING *",
        [user_id, content]
      );
    } else {
      // Anonymous user with name
      result = await pool.query(
        "INSERT INTO comments (name, content, created_at) VALUES ($1,$2,NOW()) RETURNING *",
        [name, content]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Insert comment error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all comments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch comments error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;




