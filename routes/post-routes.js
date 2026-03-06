const express = require("express");
const {
  createPost,
  fetchPost,
  deletePost,
} = require("../controllers/post-controller");
const uploadMiddleware = require("../middleware/upload-middleware");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

// post related all routes define here
router.post(
  "/create",
  authMiddleware,
  uploadMiddleware.single("image"),
  createPost,
);

// get all post data
router.get("/get", authMiddleware, fetchPost);
// delete post from database
router.delete("/delete/:id", authMiddleware, deletePost);

module.exports = router;
