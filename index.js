// ============================================
// app.js
// ============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import semua routes
const userRoutes = require("./routes/userRoute");

// ============================================
// SETUP EXPRESS
// ============================================
const app = express();

// ===== Global Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Health Check =====
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ===== Routes =====
app.use("/api/users", userRoutes);

// ============================================
// 404 HANDLER — Harus di paling bawah routes
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// ============================================
// ERROR HANDLER — Harus 4 parameter (err, req, res, next)
// ============================================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  if (statusCode >= 500) {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================
// JALANKAN SERVER
// ============================================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Server dimatikan...");
  server.close(() => process.exit(0));
});
