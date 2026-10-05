const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password harus diisi"
      });
    }

    // Cari user di database
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = rows[0];

    // Bandingkan password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: "Emily", // Bisa disesuaikan jika nama dipisah di DB
      lastName: "Smith",
      gender: "female",
      image: "https://robohash.org/" + user.username + ".png",
      token: token
    });

  } catch (err) {
    console.error("Error in POST /auth/login:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server"
    });
  }
});


// ============================================
// DELETE 1 user (Untuk testing)
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Delete the user
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (err) {
    console.error("Error in DELETE /users/:id:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});


// ============================================
// PUT 1 user (Update keseluruhan user - Untuk testing)
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password harus diisi untuk PUT",
      });
    }

    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET username = ?, password = ? WHERE id = ?", [username, hashedPassword, userId]);

    res.json({
      success: true,
      message: "User berhasil diupdate (PUT)",
    });
  } catch (err) {
    console.error("Error in PUT /users/:id:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// PATCH 1 user (Update parsial user - Untuk testing)
// ============================================
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password } = req.body;

    const [checkRows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    let updateFields = [];
    let queryParams = [];

    if (username) {
      updateFields.push("username = ?");
      queryParams.push(username);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      queryParams.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada field yang diupdate untuk PATCH",
      });
    }

    queryParams.push(userId);
    const queryStr = "UPDATE users SET " + updateFields.join(", ") + " WHERE id = ?";
    
    await db.query(queryStr, queryParams);

    res.json({
      success: true,
      message: "User berhasil diupdate secara parsial (PATCH)",
    });
  } catch (err) {
    console.error("Error in PATCH /users/:id:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});


// ============================================
// GET semua users (Untuk testing)
// ============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, created_at FROM users ORDER BY id DESC");
    
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error in GET /users:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});

// ============================================
// GET 1 user berdasarkan ID (Untuk testing)
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, created_at FROM users WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("Error in GET /users/:id:", err);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server",
    });
  }
});


// ============================================
// POST Register (Untuk menambahkan user baru)
// ============================================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password harus diisi",
      });
    }

    // Cek apakah username sudah ada
    const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    const [result] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.json({
      success: true,
      message: "User berhasil didaftarkan",
      data: {
        id: result.insertId,
        username: username
      }
    });
  } catch (err) {
    console.error("Error in POST /auth/register:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
