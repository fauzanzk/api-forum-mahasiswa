const db = require("../config/db");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

// Service: Dapatkan semua user
exports.getAll = async () => {
  const [rows] = await db.query(
    "SELECT id, username, email, image, created_at FROM users ORDER BY id DESC"
  );
  return rows;
};

// Service: Dapatkan user berdasarkan ID
exports.getById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, username, email, image, created_at FROM users WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new ApiError(404, "User tidak ditemukan");
  }

  return rows[0];
};

// Service: Buat user baru
exports.createUser = async ({ username, email, password, image = null }) => {
  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, dan password wajib diisi");
  }

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ? OR username = ?",
    [email, username]
  );

  if (existing.length > 0) {
    throw new ApiError(400, "Username atau email sudah terdaftar");
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, email, password, image, created_at) VALUES (?, ?, ?, ?, NOW())",
    [username, email, hash, image]
  );

  return { id: result.insertId, username, email, image };
};

// Service: Update user (PUT)
exports.updateUser = async (id, { username, email, password, image = null }) => {
  await exports.getById(id);

  if (!username || !email) {
    throw new ApiError(400, "Username dan email wajib diisi untuk update");
  }

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "UPDATE users SET username = ?, email = ?, password = ?, image = ? WHERE id = ?",
      [username, email, hash, image, id]
    );
  } else {
    await db.query(
      "UPDATE users SET username = ?, email = ?, image = ? WHERE id = ?",
      [username, email, image, id]
    );
  }

  return { id: Number(id), username, email, image };
};

// Service: Partial update user (PATCH)
exports.patchUser = async (id, data) => {
  await exports.getById(id);

  const updateFields = [];
  const queryParams = [];

  if (data.username) {
    updateFields.push("username = ?");
    queryParams.push(data.username);
  }
  if (data.email) {
    updateFields.push("email = ?");
    queryParams.push(data.email);
  }
  if (data.image !== undefined) {
    updateFields.push("image = ?");
    queryParams.push(data.image);
  }
  if (data.password) {
    const hash = await bcrypt.hash(data.password, 10);
    updateFields.push("password = ?");
    queryParams.push(hash);
  }

  if (updateFields.length === 0) {
    throw new ApiError(400, "Tidak ada data yang diupdate");
  }

  queryParams.push(id);
  await db.query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, queryParams);

  return exports.getById(id);
};

// Service: Hapus user
exports.deleteUser = async (id) => {
  await exports.getById(id);
  await db.query("DELETE FROM users WHERE id = ?", [id]);
  return true;
};
