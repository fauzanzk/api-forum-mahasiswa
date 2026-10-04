const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === "emilys" && password === "emilyspass") {
    res.json({
      id: 1,
      username: "emilys",
      email: "emilys@dummyjson.com",
      firstName: "Emily",
      lastName: "Smith",
      gender: "female",
      image: "https://robohash.org/emilys.png",
      token: "mock-jwt-token-12345"
    });
  } else {
    res.status(400).json({
      message: "Invalid credentials"
    });
  }
});

module.exports = router;
