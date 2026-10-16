const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function runMigration() {
  console.log("🔄 Menghubungkan ke MySQL...");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "forum_db",
    multipleStatements: true,
  });

  try {
    const sqlPath = path.join(__dirname, "forum_db.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    console.log("📦 Mengimpor struktur database & data awal dari forum_db.sql...");
    await connection.query(sql);

    console.log("✅ Berhasil! Semua tabel (termasuk post_votes, communities, posts, users) telah diperbarui.");
  } catch (err) {
    console.error("❌ Gagal migrasi database:", err.message);
  } finally {
    await connection.end();
  }
}

runMigration();
