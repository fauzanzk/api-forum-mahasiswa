const { json } = require("express");
const db = require("../config/db");

exports.getAllUser = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
    res.json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
