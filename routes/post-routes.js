const express = require("express");
const { createPost } = require("../controllers/post-controller");

const router = express.Router();

// post related all routes define here
router.post("/create", createPost);

module.exports = router;
