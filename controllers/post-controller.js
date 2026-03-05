const createPost = async (req, res) => {
  try {
    // extract post information from body
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
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

module.exports = { createPost };
