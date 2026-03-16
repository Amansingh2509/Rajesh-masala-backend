const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userschema);

module.exports = userModel;
