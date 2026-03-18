const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth.controller");
const authmiddleware = require("../middleware/auth.middleware");
const passport = require("passport");

router.post("/user/register", authcontroller.registerUser);
router.post("/user/login", authcontroller.loginUser);
router.get("/user/logout", authcontroller.logoutUser);
router.get("/profile", authmiddleware.authusermiddleware, authcontroller.getProfile);
router.put("/profile", authmiddleware.authusermiddleware, authcontroller.updateProfile);
router.post("/change-password", authmiddleware.authusermiddleware, authcontroller.changePassword);

router.post("/owner/register", authcontroller.registerOwner);
router.post("/owner/login", authcontroller.loginOwner);
router.post("/owner/logout", authcontroller.logoutOwner);
router.get("/ownerprofile", authmiddleware.authitemownerMiddleware, authcontroller.getOwnerProfile);
router.put("/ownerprofile", authmiddleware.authitemownerMiddleware, authcontroller.updateOwnerProfile);
router.post("/owner-change-password", authmiddleware.authitemownerMiddleware, authcontroller.changeOwnerPassword);

router.post("/logout", authcontroller.logout);

router.get("/google", authcontroller.googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false }), authcontroller.googleCallback);

module.exports = router;
