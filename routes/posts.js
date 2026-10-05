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


// ============================================
// DELETE 1 post (Untuk testing)
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Check if post exists
    const [checkRows] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post tidak ditemukan",
      });
    }

    // First delete dependent rows (like comments and upvotes if you have constraints without CASCADE)
    await db.query("DELETE FROM comments WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM upvotes WHERE post_id = ?", [postId]);
    
    // Delete the post
    await db.query("DELETE FROM posts WHERE id = ?", [postId]);

    res.json({
      success: true,
      message: "Post berhasil dihapus",
    });
  } catch (err) {
    console.error("Error in DELETE /posts/:id:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});


// ============================================
// PUT 1 post (Update keseluruhan post - Untuk testing)
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { kategori, judul } = req.body;

    if (!kategori || !judul) {
      return res.status(400).json({
        success: false,
        error: "Kategori dan judul harus diisi untuk PUT",
      });
    }

    const [checkRows] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post tidak ditemukan",
      });
    }

    await db.query("UPDATE posts SET kategori = ?, judul = ? WHERE id = ?", [kategori, judul, postId]);

    res.json({
      success: true,
      message: "Post berhasil diupdate (PUT)",
    });
  } catch (err) {
    console.error("Error in PUT /posts/:id:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// PATCH 1 post (Update parsial post - Untuk testing)
// ============================================
router.patch("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { kategori, judul } = req.body;

    const [checkRows] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Post tidak ditemukan",
      });
    }

    // Bangun query update dinamis
    let updateFields = [];
    let queryParams = [];

    if (kategori) {
      updateFields.push("kategori = ?");
      queryParams.push(kategori);
    }
    if (judul) {
      updateFields.push("judul = ?");
      queryParams.push(judul);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Tidak ada field yang diupdate untuk PATCH",
      });
    }

    queryParams.push(postId);
    const queryStr = "UPDATE posts SET " + updateFields.join(", ") + " WHERE id = ?";
    
    await db.query(queryStr, queryParams);

    res.json({
      success: true,
      message: "Post berhasil diupdate secara parsial (PATCH)",
    });
  } catch (err) {
    console.error("Error in PATCH /posts/:id:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});


// ============================================
// POST 1 post (Untuk menambahkan post baru)
// ============================================
router.post("/", async (req, res) => {
  try {
    const { kategori, judul } = req.body;

    if (!kategori || !judul) {
      return res.status(400).json({
        success: false,
        error: "Kategori dan judul harus diisi",
      });
    }

    const [result] = await db.query("INSERT INTO posts (kategori, judul) VALUES (?, ?)", [kategori, judul]);

    res.json({
      success: true,
      message: "Post berhasil ditambahkan",
      data: {
        id: result.insertId,
        kategori: kategori,
        judul: judul
      }
    });
  } catch (err) {
    console.error("Error in POST /posts:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
