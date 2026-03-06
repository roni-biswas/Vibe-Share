const uploadToCloudinary = require("../helpers/cloudinary-helper");
const Post = require("../models/Post");
const fs = require("fs");

const createPost = async (req, res) => {
  try {
    // extract post information from body
    const { title, description, category } = req.body;

    // upload image in cloudinary
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }
    const result = await uploadToCloudinary(req.file.path);

    // create post in database
    const newPost = new Post({
      title,
      description,
      category: category || "Technology",
      image: {
        url: result.url,
        public_id: result.public_id,
      },
      author: req.userInfo.userId,
    });
    await newPost.save();

    // delete image from local server
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(`image not deleted from local server - ${err}`);
      }
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: err.message,
    });
  }
};

const fetchPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder == "asc" ? 1 : -1;
    const totalPosts = await Post.countDocuments();
    const totalPage = Math.ceil(totalPosts / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const posts = await Post.find().sort(sortObj).skip(skip).limit(limit);

    if (posts.length > 0) {
      return res.status(200).json({
        success: true,
        totalPosts: totalPosts,
        totalPages: totalPage,
        data: posts,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: err.message,
    });
  }
};

module.exports = { createPost, fetchPost };
