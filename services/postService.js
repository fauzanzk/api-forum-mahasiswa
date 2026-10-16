const db = require("../config/db");
const ApiError = require("../utils/ApiError");

// Service: Dapatkan semua post
exports.getAll = async () => {
  const query = `
    SELECT 
      p.id, 
      p.user_id,
      p.title, 
      p.title AS judul,
      p.content,
      p.content AS kategori,
      p.created_at,
      u.username AS author_username,
      (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id) AS upvotes,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.id DESC
  `;
  const [rows] = await db.query(query);
  return rows;
};

// Service: Dapatkan 1 post berdasarkan ID
exports.getById = async (id) => {
  const query = `
    SELECT 
      p.id, 
      p.user_id,
      p.title, 
      p.title AS judul,
      p.content,
      p.content AS kategori,
      p.created_at,
      u.username AS author_username,
      (SELECT COUNT(*) FROM post_votes pv WHERE pv.post_id = p.id) AS upvotes,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;
  const [rows] = await db.query(query, [id]);

  if (rows.length === 0) {
    throw new ApiError(404, "Post tidak ditemukan");
  }

  return rows[0];
};

// Service: Tambah post baru
exports.createPost = async ({ user_id = 1, title, content = "" }) => {
  if (!title) {
    throw new ApiError(400, "Judul/title harus diisi");
  }

  const [result] = await db.query(
    "INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())",
    [user_id, title, content]
  );

  return {
    id: result.insertId,
    user_id,
    title,
    judul: title,
    content,
    kategori: content,
  };
};

// Service: Update post (PUT)
exports.updatePost = async (id, { title, content = "" }) => {
  await exports.getById(id);

  if (!title) {
    throw new ApiError(400, "Judul/title harus diisi untuk update (PUT)");
  }

  await db.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, id]
  );

  return {
    id: Number(id),
    title,
    judul: title,
    content,
    kategori: content,
  };
};

// Service: Partial update post (PATCH)
exports.patchPost = async (id, data) => {
  await exports.getById(id);

  const updateFields = [];
  const queryParams = [];

  if (data.title !== undefined) {
    updateFields.push("title = ?");
    queryParams.push(data.title);
  }
  if (data.content !== undefined) {
    updateFields.push("content = ?");
    queryParams.push(data.content);
  }

  if (updateFields.length === 0) {
    throw new ApiError(400, "Tidak ada data yang diupdate untuk PATCH");
  }

  queryParams.push(id);
  await db.query(
    `UPDATE posts SET ${updateFields.join(", ")} WHERE id = ?`,
    queryParams
  );

  return exports.getById(id);
};

// Service: Hapus post
exports.deletePost = async (id) => {
  await exports.getById(id);
  await db.query("DELETE FROM posts WHERE id = ?", [id]);
  return true;
};
