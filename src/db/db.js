const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log(
        "MongoDB Atlas connected successfully to",
        new URL(process.env.MONGODB_URI).hostname,
      );
    });
  } catch (err) {
    console.error("MongoDB Atlas failed:", err.message);
  }
};

module.exports = connectDB;
