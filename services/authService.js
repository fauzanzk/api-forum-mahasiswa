const db = require("../config/db");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

// Service: Login
exports.login = async (username, password) => {
  if (!username || !password) {
    throw new ApiError(400, "Username dan password wajib diisi");
  }

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) {
    throw new ApiError(400, "Invalid credentials");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    },
  };
};

// Service: Register
exports.register = async ({ username, email, password, image = null }) => {
  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, dan password wajib diisi");
  }

  const [existing] = await db.query(
    "SELECT id FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  if (existing.length > 0) {
    throw new ApiError(400, "Username atau email sudah digunakan");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, email, password, image, created_at) VALUES (?, ?, ?, ?, NOW())",
    [username, email, hashedPassword, image]
  );

  return {
    id: result.insertId,
    username,
    email,
    image,
  };
};
