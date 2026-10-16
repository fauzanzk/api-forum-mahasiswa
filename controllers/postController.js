const asyncHandler = require("../utils/asyncHandler");
const postService = require("../services/postService");

// GET /posts
exports.getAll = asyncHandler(async (req, res) => {
  const posts = await postService.getAll();
  res.json({
    success: true,
    total: posts.length,
    data: posts,
  });
});

// GET /posts/:id
exports.getById = asyncHandler(async (req, res) => {
  const post = await postService.getById(req.params.id);
  res.json({
    success: true,
    data: post,
  });
});

// POST /posts
exports.create = asyncHandler(async (req, res) => {
  const title = req.body.title || req.body.judul;
  const content = req.body.content || req.body.kategori || "";
  const user_id = req.body.user_id || 1;

  const post = await postService.createPost({ user_id, title, content });
  res.status(201).json({
    success: true,
    message: "Post berhasil ditambahkan",
    data: post,
  });
});

// PUT /posts/:id
exports.update = asyncHandler(async (req, res) => {
  const title = req.body.title || req.body.judul;
  const content = req.body.content || req.body.kategori || "";

  const post = await postService.updatePost(req.params.id, { title, content });
  res.json({
    success: true,
    message: "Post berhasil diupdate (PUT)",
    data: post,
  });
});

// PATCH /posts/:id
exports.patch = asyncHandler(async (req, res) => {
  const data = {};
  if (req.body.title !== undefined || req.body.judul !== undefined) {
    data.title = req.body.title !== undefined ? req.body.title : req.body.judul;
  }
  if (req.body.content !== undefined || req.body.kategori !== undefined) {
    data.content = req.body.content !== undefined ? req.body.content : req.body.kategori;
  }

  const post = await postService.patchPost(req.params.id, data);
  res.json({
    success: true,
    message: "Post berhasil diupdate secara parsial (PATCH)",
    data: post,
  });
});

// DELETE /posts/:id
exports.remove = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  res.json({
    success: true,
    message: "Post berhasil dihapus",
  });
});
