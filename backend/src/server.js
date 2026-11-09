const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PayNest API",
    status: "Server is running successfully"
  });
});

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PayNest backend is healthy"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PayNest server running on port ${PORT}`);
});
