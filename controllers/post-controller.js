const uploadToCloudinary = require("../helpers/cloudinary-helper");
const Post = require("../models/Post");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

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
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Aggregation Pipeline
    const result = await Post.aggregate([
      {
        $facet: {
          // Get the actual data
          metadata: [{ $count: "totalPosts" }],
          // Get the paginated results
          posts: [
            { $sort: { [sortBy]: sortOrder } },
            { $skip: skip },
            { $limit: limit },
            // Join with User to show who posted
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
              },
            },
            { $unwind: "$authorDetails" },
            {
              // Selection of specific fields
              $project: {
                title: 1,
                description: 1,
                image: 1,
                category: 1,
                createdAt: 1,
                "authorDetails.username": 1,
                "authorDetails.email": 1,
                "authorDetails.role": 1,
              },
            },
          ],
        },
      },
    ]);

    const totalPosts = result[0].metadata[0]?.totalPosts || 0;
    const posts = result[0].posts;

    res.status(200).json({
      success: true,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: err.message,
    });
  }
};

// post delete controller
const deletePost = async (req, res) => {
  try {
    // get current post id of post to be deleted
    const postId = req.params.id;

    // get user id (current Logged in)
    const userId = req.userInfo.userId;

    // get post by post id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found!",
      });
    }

    // check if this post is created by the current user who is try to delete this
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Your are not authorized to delete this post.",
      });
    }

    // delete image from cloudinary
    await cloudinary.uploader.destroy(post.image.public_id);

    // delete post from database
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: err.message,
    });
  }
};

module.exports = { createPost, fetchPost, deletePost };
