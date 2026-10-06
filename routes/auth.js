const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
require("dotenv").config();

// ============================================
// POST Login
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username dan password harus diisi" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      token: token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Error in POST /auth/login:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ============================================
// POST Register 
// ============================================
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: "Username, password, dan email harus diisi" });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Username sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)", 
      [username, hashedPassword, email]
    );

    res.json({
      success: true,
      message: "User berhasil didaftarkan",
      data: { id: result.insertId, username: username, email: email }
    });
  } catch (err) {
    console.error("Error in POST /auth/register:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
