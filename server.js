const express = require("express");
const cors = require("cors");
require("dotenv").config();

const orangsRouter = require("./routes/orangs.js"); // ← ganti

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route utama
app.get("/", (req, res) => {
  res.json({
    message: "API Forum",
    version: "1.0.0",
    endpoints: {
      orangs: "/api/orangs", // ← ganti
    },
  });
});

// Route orangs
app.use("/data", orangsRouter); // ← ganti

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint tidak ditemukan",
  });
});

// Jalankan server
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/orangs`);
});
