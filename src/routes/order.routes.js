const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User places order (user auth only)
router.post(
  "/",
  authMiddleware.authusermiddleware,
  orderController.createOrder,
);

// Owner views all orders (public - single owner app)
router.get("/", orderController.getOrders);

module.exports = router;
