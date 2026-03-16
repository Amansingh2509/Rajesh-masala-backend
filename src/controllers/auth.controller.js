const userModel = require("../models/user.model");
const ownerModel = require("../models/owner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

async function registerUser(req, res) {
  const { fullname, email, phone, address, password } = req.body;
  try {
    const isUseralreadyexist = await userModel.findOne({
      email,
    });
    if (isUseralreadyexist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullname,
      email,
      phone,
      address,
      password: hashedpassword,
    });
    res.status(201).json({
      message: "user registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
}

async function loginuser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isvalidpassword = await bcrypt.compare(password, user.password);
    if (!isvalidpassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({
      message: "user logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function logoutuser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "user logged out successfully",
  });
}

async function getProfile(req, res) {
  res.status(200).json(req.user);
}

async function registerowner(req, res) {
  const { fullname, email, phone, address, password } = req.body;
  try {
    const isOwneralreadyexist = await ownerModel.findOne({
      email,
    });
    if (isOwneralreadyexist) {
      return res.status(400).json({
        message: "owner already exist",
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const ownerpartner = await ownerModel.create({
      fullname,
      email,
      phone,
      address,
      password: hashedpassword,
    });
    res.status(201).json({
      message: "owner registered successfully",
      owner: {
        id: ownerpartner._id,
        fullname: ownerpartner.fullname,
        email: ownerpartner.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering owner",
      error: error.message,
    });
  }
}

async function loginowner(req, res) {
  const { email, password } = req.body;
  try {
    const owner = await ownerModel.findOne({
      email,
    });
    if (!owner) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isvalidpassword = await bcrypt.compare(password, owner.password);
    if (!isvalidpassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: owner._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({
      message: "owner logged in successfully",
      owner: {
        _id: owner._id,
        fullname: owner.fullname,
        email: owner.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function logoutowner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "owner logged out successfully",
  });
}

async function getOwnerProfile(req, res) {
  res.status(200).json(req.itemOwner);
}

function googleAuth(req, res) {
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=profile%20email&response_type=code&access_type=offline&prompt=consent`,
  );
}

function googleCallback(req, res) {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect("http://localhost:5173/user/login?error=auth_failed");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.redirect("http://localhost:5173/user/home");
  })(req, res);
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "logged out successfully",
  });
}

module.exports = {
  registerUser,
  loginuser,
  logoutuser,
  registerowner,
  loginowner,
  logoutowner,
  getProfile,
  getOwnerProfile,
  googleAuth,
  googleCallback,
  logout,
};
