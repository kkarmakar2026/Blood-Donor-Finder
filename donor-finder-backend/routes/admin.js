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

// ===========================
// Submit a new report (public)
// ===========================
router.post("/reports", async (req, res) => {
  try {
    const { donor_name, email, blood_group, reason, description } = req.body;

    if (!donor_name || !email || !blood_group || !reason) {
      return res.status(400).json({ error: "donor_name, email, blood_group, and reason are required" });
    }

    const userResult = await pool.query(
      "SELECT user_id FROM users WHERE email=$1",
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ error: "Donor not found" });
    }

    const donor_id = userResult.rows[0].user_id;

    const reportResult = await pool.query(
      `INSERT INTO donor_reports (donor_id, reason, description)
       VALUES ($1, $2, $3)
       RETURNING report_id, donor_id, reason, description, status, reported_at`,
      [donor_id, reason, description || null]
    );

    res.status(201).json({
      message: "Report submitted successfully",
      report: reportResult.rows[0],
    });
  } catch (err) {
    console.error("Submit report error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
// Admin Get Pending Reports + Search
// ===========================
// Get all pending reports (with pagination + search)
router.get("/reports", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // count total
    const countResult = await pool.query(
      `SELECT COUNT(*) 
       FROM donor_reports dr
       JOIN users u ON dr.donor_id = u.user_id
       WHERE u.full_name ILIKE $1 OR dr.reason ILIKE $1`,
      [`%${search}%`]
    );

    const total = parseInt(countResult.rows[0].count, 10);

    // fetch records
    const result = await pool.query(
      `SELECT dr.report_id, dr.donor_id, dr.reason, dr.description, dr.reported_at,
              u.full_name, u.email, u.phone
       FROM donor_reports dr
       JOIN users u ON dr.donor_id = u.user_id
       WHERE u.full_name ILIKE $1 OR dr.reason ILIKE $1
       ORDER BY dr.reported_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    res.json({
      reports: result.rows,
      total,
    });
  } catch (err) {
    console.error("Fetch reports error:", err.message);
    res.status(500).json({ error: "Server error while fetching reports" });
  }
});


// ===========================
// Feedback Routes
// ===========================

// POST - Submit new feedback (public)
router.post("/feedback", async (req, res) => {
  try {
    const { name, email, mobile, feedback } = req.body;

    if (!name || !email || !mobile || !feedback) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO feedback (name, email, mobile, feedback) 
       VALUES ($1, $2, $3, $4) 
       RETURNING feedback_id, name, email, mobile, feedback, created_at`,
      [name, email, mobile, feedback]
    );

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: result.rows[0],
    });
  } catch (err) {
    console.error("Submit feedback error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch feedback with pagination + search
router.get("/feedback", verifyAdminToken, async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    let query = `SELECT feedback_id, name, email, mobile, feedback, created_at 
                 FROM feedback`;
    let countQuery = `SELECT COUNT(*) FROM feedback`;
    let values = [];

    if (search) {
      query += ` WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1`;
      countQuery += ` WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countResult = await pool.query(countQuery, search ? [`%${search}%`] : []);

    res.json({
      feedbacks: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error("Fetch feedback error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE Feedback
router.delete("/feedback/:id", verifyAdminToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM feedback WHERE feedback_id = $1 RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Delete feedback error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Resolve a report (move to resolved_reports and delete from reports)
router.put("/reports/:id/resolve", verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const{resolution_notes} = req.body;

  try {
    // 1. Fetch report details
    const reportResult = await pool.query(
      `SELECT * FROM donor_reports WHERE report_id = $1`,
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    const report = reportResult.rows[0];

    // 2. Insert into resolved_reports
    await pool.query(
      `INSERT INTO resolved_reports (report_id, donor_id, reason, description, reported_at,resolution_notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        report.report_id,
        report.donor_id,
        report.reason,
        report.description,
        report.reported_at,
        resolution_notes || null,
      ]
    );

    // 3. Delete from reports (pending table)
    await pool.query(`DELETE FROM donor_reports WHERE report_id = $1`, [id]);

    res.json({ message: "Report resolved successfully" });
  } catch (err) {
    console.error("Resolve report error:", err.message);
    res.status(500).json({ error: "Server error while resolving report" });
  }
});

// Fetch resolved_reports
router.get("/resolved_reports", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rr.resolved_id, rr.report_id, rr.reason, rr.description, rr.reported_at, rr.resolved_at, u.full_name,u.email,u.phone
       FROM resolved_reports rr
       JOIN users u ON rr.donor_id = u.user_id
       ORDER BY rr.resolved_at DESC`
    );

    res.json({
      reports: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resolved reports" });
  }
});






export default router;
