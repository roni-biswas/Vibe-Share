require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// connect with database

// middleware
app.use(express.json());

// routes

// listening server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
