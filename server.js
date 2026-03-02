require("dotenv").config();
const connectToDatabase = require("./database/db");
const express = require("express");
const authRoutes = require("./routes/auth-routes");

const app = express();
const PORT = process.env.PORT || 5000;

// connect with database
connectToDatabase();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// listening server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
