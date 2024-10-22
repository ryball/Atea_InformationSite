// blog.js - Blog routes
const express = require("express");
const pool = require("../config/db");
const connectMongoDB = require("../config/mongodb");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const [blogs] = await pool.query(
      "SELECT blogs.blog_id, blogs.title, users.username FROM blogs INNER JOIN users ON blogs.user_id = users.id"
    );

    const db = await connectMongoDB();
    const blogContent = await db.collection("blog_content").find({}).toArray();

    const mergedBlogs = blogs.map((blog) => {
      const content = blogContent.find((b) => b.blog_id === blog.blog_id);
      return {
        ...blog,
        content: content ? content.content : "",
      };
    });

    res.json(mergedBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
