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

module.exports = router;
