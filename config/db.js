const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("gagal koneksi ke database: ", err.message);
    return;
  }
  console.log("berhasil terhubung ke database");
  connection.release();
});

module.exports = pool.promise();
