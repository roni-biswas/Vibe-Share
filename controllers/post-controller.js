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
      // author:
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

module.exports = { createPost };
