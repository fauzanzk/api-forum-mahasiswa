const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");

// POST /auth/login
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);

  res.json({
    success: true,
    message: "Login berhasil",
    token: result.token,
    user: result.user,
  });
});

// POST /auth/register
exports.register = asyncHandler(async (req, res) => {
  const username = req.body.username || req.body.nama;
  const { email, password, image } = req.body;

  const user = await authService.register({ username, email, password, image });

  res.status(201).json({
    success: true,
    message: "User berhasil didaftarkan",
    data: user,
  });
});
