const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
const userLogin = async (req, res) => {};

module.exports = { userRegister, userLogin };
