const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const axios = require("axios");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation FIRST (avoid crashes)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // 2. Normalize AFTER validation
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 3. Check if user exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, created_at`,
      [normalizedEmail, hashedPassword, "user"]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ CALL AI SERVICE
    let isAnomalous = false;
    let riskScore = 0;

    try {
      const response = await axios.post(
        `${process.env.ANOMALY_API_URL}/analyse`,
        {
          user_id: user.id,
          ip_address: req.ip || req.headers["x-forwarded-for"],
          user_agent: req.headers["user-agent"] || "unknown",
          hour_of_day: new Date().getHours()
        }
      );

      isAnomalous = response.data.flagged;
      riskScore = response.data.risk_score;

    } catch (err) {
      console.error("Anomaly service error:", err.message);
      isAnomalous = false;
    }

    // ✅ GENERATE TOKENS
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    // ✅ STORE LOGIN EVENT WITH FLAG
    await pool.query(
      `INSERT INTO login_events (user_id, ip_address, user_agent, flagged)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        req.ip,
        req.headers["user-agent"] || "unknown",
        isAnomalous
      ]
    );

    if (isAnomalous) {
      console.log(`⚠️ ANOMALY DETECTED for ${user.email} (risk: ${riskScore})`);
    }

    // ✅ STORE SESSION
    await pool.query(
      `INSERT INTO sessions (user_id, refresh_token, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
      [
        user.id,
        refreshToken,
        req.ip,
        req.headers["user-agent"] || "unknown"
      ]
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };