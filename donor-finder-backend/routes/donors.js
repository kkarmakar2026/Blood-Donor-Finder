// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// // Add donor details
// router.post("/", async (req, res) => {
//   const { user_id, blood_group, availability, last_donation } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO donors (user_id, blood_group, availability, last_donation) VALUES ($1,$2,$3,$4) RETURNING *",
//       [user_id, blood_group, availability, last_donation]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all donors
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT donors.*, users.full_name, users.city, users.phone FROM donors JOIN users ON donors.user_id = users.user_id"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Search donors by city & blood group
// router.get("/search", async (req, res) => {
//   const { city, blood_group } = req.query;
//   try {
//     const result = await pool.query(
//       "SELECT donors.*, users.full_name, users.city, users.phone FROM donors JOIN users ON donors.user_id = users.user_id WHERE users.city ILIKE $1 AND donors.blood_group=$2",
//       [`%${city}%`, blood_group]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


// routes/donors.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/donors
 * Returns all available donors
 */
router.get("/", async (req, res) => {
  try {
    const q = `
      SELECT d.donor_id, u.user_id, u.full_name, u.email, u.phone, u.city,
             d.blood_group, d.availability, d.last_donation
      FROM donors d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.availability = TRUE
      ORDER BY u.full_name ASC
    `;
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/donors error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/donors/search
 * Query params:
 *   - city (optional, partial match)
 *   - blood_group (optional, exact match)
 */
router.get("/search", async (req, res) => {
  try {
    const { city, blood_group } = req.query;

    let query = `
      SELECT d.donor_id, u.user_id, u.full_name, u.email, u.phone, u.city,
             d.blood_group, d.availability, d.last_donation
      FROM donors d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.availability = TRUE
    `;
    const params = [];

    if (city && city.trim() !== "") {
      params.push(`%${city.trim()}%`);
      query += ` AND LOWER(u.city) LIKE LOWER($${params.length})`;
    }

    if (blood_group && blood_group.trim() !== "") {
      params.push(blood_group.trim());
      query += ` AND d.blood_group = $${params.length}`;
    }

    query += ` ORDER BY u.full_name ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/donors/search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/donors
 * Add a donor (usually called after registering a user)
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, blood_group, availability } = req.body;

    if (!user_id || !blood_group) {
      return res.status(400).json({ error: "User ID and blood group are required" });
    }

    const result = await pool.query(
      `INSERT INTO donors (user_id, blood_group, availability, last_donation)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [user_id, blood_group, availability ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/donors error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /api/donors/:donor_id
 * Update donor availability or last donation
 */
router.put("/:donor_id", async (req, res) => {
  try {
    const { donor_id } = req.params;
    const { availability, last_donation } = req.body;

    const result = await pool.query(
      `UPDATE donors
       SET availability = COALESCE($1, availability),
           last_donation = COALESCE($2, last_donation)
       WHERE donor_id = $3
       RETURNING *`,
      [availability, last_donation, donor_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Donor not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/donors/:donor_id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/donors/:donor_id
 * Remove a donor (admin only)
 */
router.delete("/:donor_id", async (req, res) => {
  try {
    const { donor_id } = req.params;

    const result = await pool.query(
      "DELETE FROM donors WHERE donor_id = $1 RETURNING *",
      [donor_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Donor not found" });
    }

    res.json({ message: "Donor deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/donors/:donor_id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
