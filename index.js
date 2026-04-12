const express = require("express");
const pool = require("./src/models/db");

const app = express();
app.use(express.json());
const authRoutes = require("./src/routes/auth.routes");

app.use("/api/auth", authRoutes);

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