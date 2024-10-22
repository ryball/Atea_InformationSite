// tutorial.js - Tutorial routes
const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware/authenticateToken");
const pool = require("../config/db");

const router = express.Router();

// Set up multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get all tutorials
router.get("/", (req, res) => {
  pool.query("SELECT * FROM tutorials", (err, results) => {
    if (err) {
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});

// Upload a tutorial video
router.post("/", authenticateToken, upload.single("video"), (req, res) => {
  if (
    req.user.role !== "Admin" &&
    req.user.role !== "Contributor" &&
    req.user.role !== "MainAdmin"
  ) {
    return res.status(403).send("Access denied");
  }

  const { title, category } = req.body;
  const videoUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  pool.query(
    "INSERT INTO tutorials (title, url, category) VALUES (?, ?, ?)",
    [title, videoUrl, category],
    (err) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      res.send("Tutorial uploaded successfully");
    }
  );
});

module.exports = router;
