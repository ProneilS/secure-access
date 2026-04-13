const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const http = require("http");

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

  // 1. Validation FIRST
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // 2. Normalize
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 3. Fetch user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5. Generate tokens
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

    // 6. Log login event
    await pool.query(
      `INSERT INTO login_events (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [
        user.id,
        req.ip,
        req.headers["user-agent"] || "unknown"
      ]
    );
// Send login event to anomaly service
const loginEventData = JSON.stringify({
  user_id: user.id,
  ip_address: req.ip,
  user_agent: req.headers["user-agent"] || "unknown",
  hour_of_day: new Date().getHours()
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/analyse",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(loginEventData)
  }
};

const anomalyReq = http.request(options, (anomalyRes) => {
  let responseData = "";
  anomalyRes.on("data", (chunk) => { responseData += chunk; });
  anomalyRes.on("end", async () => {
    try {
      const result = JSON.parse(responseData);
      if (result.flagged) {
        await pool.query(
  `UPDATE login_events SET flagged = true 
   WHERE id = (
     SELECT id FROM login_events 
     WHERE user_id = $1 
     ORDER BY timestamp DESC 
     LIMIT 1
   )`,
  [user.id]
);
        console.log(`ANOMALY DETECTED for user ${user.email} — risk score: ${result.risk_score}`);
      }
    } catch (e) {
      console.error("Anomaly parse error:", e.message);
    }
  });
});

anomalyReq.on("error", (e) => {
  console.error("Anomaly service unreachable:", e.message);
});

anomalyReq.write(loginEventData);
anomalyReq.end();    
    // 7. Store session
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