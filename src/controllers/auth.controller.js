const userModel = require("../models/user.model");
const ownerModel = require("../models/owner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// =======================
// USER CONTROLLERS
// =======================

// Register User
async function registerUser(req, res) {
  try {
    const { fullname, email, phone, address, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
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

// Login User
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Logout User
function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

// Get Profile
function getProfile(req, res) {
  res.status(200).json(req.user);
}

// Update Profile
async function updateProfile(req, res) {
  try {
    const { fullname, phone, address } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { fullname, phone, address },
      { new: true },
    );

    res.json({ success: true, profile: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Change Password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// =======================
// OWNER CONTROLLERS
// =======================

// Register Owner
async function registerOwner(req, res) {
  try {
    const { fullname, email, phone, address, password } = req.body;

    const existingOwner = await ownerModel.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await ownerModel.create({
      fullname,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Owner registered successfully",
      owner: {
        id: owner._id,
        fullname: owner.fullname,
        email: owner.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering owner",
      error: error.message,
    });
  }
}

// Login Owner
async function loginOwner(req, res) {
  try {
    const { email, password } = req.body;

    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, owner.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Owner logged in successfully",
      owner: {
        _id: owner._id,
        fullname: owner.fullname,
        email: owner.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Logout Owner
function logoutOwner(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Owner logged out successfully" });
}

// Owner Profile
function getOwnerProfile(req, res) {
  res.status(200).json(req.itemOwner);
}

// Update Owner Profile
async function updateOwnerProfile(req, res) {
  try {
    const { fullname, phone, address } = req.body;

    const updatedOwner = await ownerModel.findByIdAndUpdate(
      req.itemOwner._id,
      { fullname, phone, address },
      { new: true },
    );

    res.json({ success: true, profile: updatedOwner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Change Owner Password
async function changeOwnerPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const owner = await ownerModel.findById(req.itemOwner._id);

    const isMatch = await bcrypt.compare(currentPassword, owner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    owner.password = await bcrypt.hash(newPassword, 10);
    await owner.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// =======================
// GOOGLE AUTH
// =======================

function googleAuth(req, res) {
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=profile%20email&response_type=code`,
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

// =======================
// COMMON
// =======================

function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

// =======================
// EXPORTS
// =======================

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword,

  registerOwner,
  loginOwner,
  logoutOwner,
  getOwnerProfile,
  updateOwnerProfile,
  changeOwnerPassword,

  googleAuth,
  googleCallback,
  logout,
};
