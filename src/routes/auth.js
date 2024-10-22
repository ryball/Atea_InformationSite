// auth.js - Authentication routes
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const [results] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: "1h" }
    );

    console.log(`User ${username} logged in successfully`);
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;