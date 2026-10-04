const express = require("express");
const cors = require("cors");
require("dotenv").config();

const postsRouter = require("./routes/posts.js");
const authRouter = require("./routes/auth.js");
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
      posts: "/posts",
      auth: "/auth/login",
    },
  });
});

// Routes
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
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
  console.log(`📚 Posts API: http://localhost:${PORT}/posts`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/auth/login`);
});
