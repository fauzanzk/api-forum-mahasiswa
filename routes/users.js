const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

// Semua route di file ini dilindungi oleh verifyToken
router.use(verifyToken);

// ============================================
// GET semua users
// ============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, email, created_at FROM users ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in GET /users:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// GET 1 user berdasarkan ID
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, email, created_at FROM users WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Error in GET /users/:id:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// PUT 1 user 
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: "Username, password, dan email harus diisi" });
    }

    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?", [username, hashedPassword, email, userId]);

    res.json({ success: true, message: "User berhasil diupdate (PUT)" });
  } catch (err) {
    console.error("Error in PUT /users/:id:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// PATCH 1 user 
// ============================================
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, email } = req.body;

    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    let updateFields = [];
    let queryParams = [];

    if (username) { updateFields.push("username = ?"); queryParams.push(username); }
    if (email) { updateFields.push("email = ?"); queryParams.push(email); }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?"); queryParams.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada field yang diupdate untuk PATCH" });
    }

    queryParams.push(userId);
    const queryStr = "UPDATE users SET " + updateFields.join(", ") + " WHERE id = ?";
    await db.query(queryStr, queryParams);

    res.json({ success: true, message: "User berhasil diupdate secara parsial (PATCH)" });
  } catch (err) {
    console.error("Error in PATCH /users/:id:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// DELETE 1 user
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ success: true, message: "User berhasil dihapus" });
  } catch (err) {
    console.error("Error in DELETE /users/:id:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
