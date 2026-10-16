const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
const ApiError = require("../utils/ApiError");

// GET /users
exports.getAll = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json({
    success: true,
    total: users.length,
    data: users,
  });
});

// GET /users/:id
exports.getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json({
    success: true,
    data: user,
  });
});

// POST /users
exports.create = asyncHandler(async (req, res) => {
  const username = req.body.username || req.body.nama;
  const { email, password, image } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, dan password wajib diisi");
  }

  const user = await userService.createUser({ username, email, password, image });
  res.status(201).json({
    success: true,
    message: "User berhasil dibuat",
    data: user,
  });
});

// PUT /users/:id
exports.update = asyncHandler(async (req, res) => {
  const username = req.body.username || req.body.nama;
  const { email, password, image } = req.body;

  const user = await userService.updateUser(req.params.id, {
    username,
    email,
    password,
    image,
  });

  res.json({
    success: true,
    message: "User berhasil diupdate (PUT)",
    data: user,
  });
});

// PATCH /users/:id
exports.patch = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.body.nama && !req.body.username) {
    data.username = req.body.nama;
  }

  const user = await userService.patchUser(req.params.id, data);
  res.json({
    success: true,
    message: "User berhasil diupdate secara parsial (PATCH)",
    data: user,
  });
});

// DELETE /users/:id
exports.remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({
    success: true,
    message: "User berhasil dihapus",
  });
});
