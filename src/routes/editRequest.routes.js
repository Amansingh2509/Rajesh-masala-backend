const express = require("express");
const router = express.Router();
const editRequestController = require("../controllers/editRequest.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Submit edit request (User)
router.post(
  "/",
  authMiddleware.authusermiddleware,
  editRequestController.submitEditRequest,
);

// Get owner's pending edit requests (Owner)
router.get(
  "/owner",
  authMiddleware.authitemownerMiddleware,
  editRequestController.getOwnerEditRequests,
);

// Review edit request (Owner)
router.patch(
  "/:id/review",
  authMiddleware.authitemownerMiddleware,
  editRequestController.reviewEditRequest,
);

module.exports = router;
