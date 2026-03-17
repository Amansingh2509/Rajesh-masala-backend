const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth.controller");
const authmiddleware = require("../middleware/auth.middleware");
const passport = require("passport");

// user
router.post("/user/register", authcontroller.registerUser);
router.post("/user/login", authcontroller.loginuser);
router.get("/user/logout", authcontroller.logoutuser);
router.get(
  "/profile",
  authmiddleware.authusermiddleware,
  authcontroller.getProfile,
);

// owner
router.post("/owner/register", authcontroller.registerowner);
router.post("/owner/login", authcontroller.loginowner);
router.post("/owner/logout", authcontroller.logoutowner);
router.get(
  "/ownerprofile",
  authmiddleware.authitemownerMiddleware,
  authcontroller.getOwnerProfile,
);

// unified logout
router.post("/logout", authcontroller.logout);

// Google OAuth
router.get("/google", authcontroller.googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authcontroller.googleCallback,
);

module.exports = router;
