const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register/signup controller
const userRegister = async (req, res) => {
  try {
    // extract user information from the body
    const { username, email, password, role } = req.body;

    // check same user exists or not
    const isExistedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (isExistedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists either with same username or same email!",
      });
    }

    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user and save in database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          username,
          email,
          role,
        },
      });
    }
    res.status(400).json({
      success: false,
      message: "Unable to register user! Please try again",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// login controller
const userLogin = async (req, res) => {
  try {
    // extract user information -> email, password
    const { email, password } = req.body;

    // check user email is exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exists! Please try again",
      });
    }

    // password validation
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JSON_SECRET_KEY,
      { expiresIn: "30d" },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { userRegister, userLogin };
