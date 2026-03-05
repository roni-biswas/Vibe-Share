const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, "Title cannot be more then 100 characters"],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Lifestyle", "Coding", "Education"],
      default: "Technology",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
