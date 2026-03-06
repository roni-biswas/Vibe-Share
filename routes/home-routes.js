const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  res.send("Welcome to home page");
});

module.exports = router;
