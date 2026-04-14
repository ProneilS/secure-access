const express = require("express");
const cors = require("cors");
const pool = require("./src/models/db");

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});

// TEST DB CONNECTION
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error", err));

// ✅ FIXED PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});