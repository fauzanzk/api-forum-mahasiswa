const express = require("express");
const cors = require("cors");
require("dotenv").config();

const postsRouter = require("./routes/posts.js");
const authRouter = require("./routes/auth.js");
const usersRouter = require("./routes/users.js");
const notFound = require("./middlewares/notFound.js");
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check & Info endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Selamat datang di API Forum Mahasiswa",
    status: "Active",
    endpoints: {
      posts: "/posts",
      auth: {
        login: "POST /auth/login",
        register: "POST /auth/register",
      },
      users: "/users",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Routes (menggunakan endpoint milik Anda)
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
  console.log(`📚 Posts API: http://localhost:${PORT}/posts`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/auth/login`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Server dimatikan...");
  server.close(() => process.exit(0));
});

module.exports = app;
