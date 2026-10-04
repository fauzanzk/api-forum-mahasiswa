const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// ============================================
// GET semua orang
// ============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orang ORDER BY id DESC");
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ============================================
// GET 1 orang
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orang WHERE id = ?", [
      req.params.id,
    ]);

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
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ============================================
// POST buat orang baru
// ============================================
router.post("/", async (req, res) => {
  try {
    const { nama, umur } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        error: "Nama harus diisi",
      });
    }

    const [result] = await db.query(
      "INSERT INTO orang (nama, umur) VALUES (?, ?)",
      [nama, umur || null],
    );

    const [rows] = await db.query("SELECT * FROM orang WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ============================================
// PUT update orang
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const { nama, umur } = req.body;
    const { id } = req.params;

    const [existing] = await db.query("SELECT * FROM orang WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Data tidak ditemukan",
      });
    }

    await db.query("UPDATE orang SET nama = ?, umur = ? WHERE id = ?", [
      nama || existing[0].nama,
      umur || existing[0].umur,
      id,
    ]);

    const [rows] = await db.query("SELECT * FROM orang WHERE id = ?", [id]);

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ============================================
// DELETE hapus orang
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM orang WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
