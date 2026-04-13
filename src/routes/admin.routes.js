const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const pool = require("../models/db");

// All admin routes require valid token + admin role
router.use(verifyToken);
router.use(requireRole("admin"));

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
    const totalLogins = await pool.query("SELECT COUNT(*) FROM login_events");
    const totalFlagged = await pool.query("SELECT COUNT(*) FROM login_events WHERE flagged = true");

    res.json({
      total_users: parseInt(totalUsers.rows[0].count),
      total_logins: parseInt(totalLogins.rows[0].count),
      total_flagged: parseInt(totalFlagged.rows[0].count)
    });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/login-events
router.get("/login-events", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        le.id,
        le.user_id,
        u.email,
        le.ip_address,
        le.user_agent,
        le.flagged,
        le.timestamp
       FROM login_events le
       JOIN users u ON le.user_id = u.id
       ORDER BY le.timestamp DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Login events error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/sessions
router.get("/sessions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.user_id,
        u.email,
        s.ip_address,
        s.user_agent,
        s.created_at,
        s.expires_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.expires_at > NOW()
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Sessions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;