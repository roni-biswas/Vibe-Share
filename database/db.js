const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connected successfully");
  } catch (err) {
    console.error("Mongodb connection failed");
  }
};

module.exports = connectToDatabase;
