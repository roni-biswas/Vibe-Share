const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // get token from headers
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied! No token provided. Please login to continue",
    });
  }

  //   decoded/verify token
  try {
    const decodedToken = jwt.verify(token, process.env.JSON_SECRET_KEY);
    req.userInfo = decodedToken;
  } catch (err) {
    res.status(403).json({
      success: false,
      message: "Not validated token!",
    });
  }
  next();
};

module.exports = authMiddleware;
