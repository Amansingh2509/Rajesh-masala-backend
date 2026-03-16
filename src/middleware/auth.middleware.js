const ownerModel = require("../models/owner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authitemownerMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "please login first ",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const itemOwner = await ownerModel.findById(decoded.id);
    if (!itemOwner) {
      return res.status(401).json({
        message: "Owner not found",
      });
    }
    req.itemOwner = itemOwner;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

async function authusermiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "please login first",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

module.exports = {
  authitemownerMiddleware,
  authusermiddleware,
};
