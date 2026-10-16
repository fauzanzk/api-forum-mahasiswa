const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "forum_db",
  waitForConnections: true,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Berhasil terhubung ke database MySQL");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL gagal terhubung:", err.message);
  }
})();

module.exports = db;
