const db = require("../config/db");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

// service get all user
exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
  return rows;
};

// service get user by id
exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);

  if (!rows[0]) {
    throw new ApiError(404, "user tidak ditemukan");
  }

  return rows[0];
};

// service create user
exports.createUser = async ({ username, email, password }) => {
  const [existing] = await db.query("SELECT * FROM users WHERE email=?", [
    email,
  ]);

  if (existing > 0) {
    throw new Error(409, "Email sudah terdaftar");
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hash],
  );

  return { id: result.insertId, email, username };
};

// service update user
exports.updateUser = async (id, { username, email }) => {
  await exports.getById(id);

  await db.query("UPDATE users SET username=? , email=? WHERE id=?", [
    username,
    email,
    id,
  ]);

  return { id, username, email };
};

// service delete user
exports.deleteUser = async (id) => {
  await exports.getById(id);
  await db.query("DELETE FROM users WHERE id=?", [id]);
  return true;
};
