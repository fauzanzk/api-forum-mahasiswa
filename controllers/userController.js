const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
const apiError = require("../utils/ApiError");

// GET /users
exports.list = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json({
    success: true,
    total: users.length,
    data: users,
  });
});

// GET /users/:id
exports.detail = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json({
    success: true,
    data: user,
  });
});

// POST /users
exports.create = asyncHandler(async (req, res) => {
  const { nama, email, password } = req.body;

  // Validasi basic (opsional — bisa juga di middleware)
  if (!nama || !email || !password) {
    throw new ApiError(400, "nama, email, dan password wajib diisi");
  }

  const user = await userService.create({ nama, email, password });
  res.status(201).json({
    success: true,
    message: "User berhasil dibuat",
    data: user,
  });
});

// PUT /users/:id
exports.update = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json({
    success: true,
    message: "User berhasil diupdate",
    data: user,
  });
});

// DELETE /users/:id
exports.remove = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id);
  res.json({
    success: true,
    message: "User berhasil dihapus",
  });
});
