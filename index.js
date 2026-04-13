const express = require("express");
const cors = require("cors");
const pool = require("./src/models/db");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));
const authRoutes = require("./src/routes/auth.routes");

app.use("/api/auth", authRoutes);
const adminRoutes = require("./src/routes/admin.routes");
app.use("/api/admin", adminRoutes);
// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running");
});

// TEST DB CONNECTION
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error", err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});