const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/rajeshmasala",
      )
      .then(() => {
        console.log("MongoDB connected successfully");
      });
  } catch (err) {
    console.log("MongoDB not connected:", err.message);
  }
};

module.exports = connectDB;
