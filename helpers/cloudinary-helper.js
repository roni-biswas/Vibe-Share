const { cloudinary } = require("../config/cloudinary");

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error("Error while uploading to cloudinary");
  }
};

module.exports = uploadToCloudinary;
