const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db.js");
const postsRouter = require("./routes/posts.js");
const authRouter = require("./routes/auth.js");
const usersRouter = require("./routes/users.js"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Selamat datang di API Forum Mahasiswa",
    status: "Active",
    endpoints: {
      posts: "/posts",
      auth: "/auth/login",
      users: "/users"
    },
  });
});

// Routes
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter); 

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
  console.log(`📚 Posts API: http://localhost:${PORT}/posts`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/auth/login`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
});
