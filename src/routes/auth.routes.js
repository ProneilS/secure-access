const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route — any authenticated user
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

// Protected route — admin only
router.get("/admin", verifyToken, requireRole("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;