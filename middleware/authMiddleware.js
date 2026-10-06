const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No token provided."
    });
  }

  try {
    const bearerToken = token.split(" ")[1] || token;
    const verified = jwt.verify(bearerToken, process.env.JWT_SECRET || "default_secret_key");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid token."
    });
  }
};

module.exports = { verifyToken };
