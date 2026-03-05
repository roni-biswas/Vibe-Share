const express = require("express");
const { createPost } = require("../controllers/post-controller");
const uploadMiddleware = require("../middleware/upload-middleware");

const router = express.Router();

// post related all routes define here
router.post("/create", uploadMiddleware.single("image"), createPost);

module.exports = router;
