// user.js - User profile and role management routes
const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, (req, res) => {
  pool.query(
    "SELECT username, role, preferredCategories FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        return res.status(404).send("User not found");
      }
      const user = results[0];
      if (user.preferredCategories) {
        user.preferredCategories = JSON.parse(user.preferredCategories);
      }
      res.json(user);
    }
  );
});

// Update user profile
router.put("/profile", authenticateToken, (req, res) => {
  const { preferredCategories } = req.body;

  if (!preferredCategories) {
    return res.status(400).send("Preferred categories are required");
  }

  pool.query(
    "UPDATE users SET preferredCategories = ? WHERE id = ?",
    [JSON.stringify(preferredCategories), req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("User not found");
      }
      res.send("Profile updated successfully");
    }
  );
});

module.exports = router;
