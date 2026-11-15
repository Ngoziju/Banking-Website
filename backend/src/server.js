
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PayNest API"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PayNest backend is healthy"
  });
});

// Test PostgreSQL connection
const testDatabaseConnection = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PayNest database connected successfully!",
      time: result.rows[0].now
    });

  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
};

app.get("/api/db-test", testDatabaseConnection);
app.get("/api/test-db", testDatabaseConnection);

// Protected route - JWT verification test
app.get("/api/protected-test", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected PayNest route!",
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PayNest server running on port ${PORT}`);
});
