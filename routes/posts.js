const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// ============================================
// GET semua posts
// ============================================
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, 
        p.kategori AS nama, 
        p.judul,
        (SELECT COUNT(*) FROM upvotes u WHERE u.post_id = p.id) AS upvotes,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments
      FROM posts p
      ORDER BY p.id DESC
    `;
    const [rows] = await db.query(query);
    
    // Note: upvotes and comments will be numbers as requested (not strings like "1.2k")
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error in GET /posts:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// GET 1 post (opsional)
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, 
        p.kategori AS nama, 
        p.judul,
        (SELECT COUNT(*) FROM upvotes u WHERE u.post_id = p.id) AS upvotes,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments
      FROM posts p
      WHERE p.id = ?
    `;
    const [rows] = await db.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Error in GET /posts/:id:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
