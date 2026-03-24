const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ================= CREATE ORDER =================
router.post(
  "/",
  authMiddleware.authusermiddleware,
  orderController.createOrder,
);

// ================= UPDATE ORDER STATUS (OWNER) =================
router.put(
  "/:id/status",
  authMiddleware.authitemownerMiddleware,
  orderController.updateOrderStatus,
);

// ================= GET ALL ORDERS =================
router.get(
  "/",
  authMiddleware.authitemownerMiddleware,
  orderController.getOrders,
);

// ================= DELETE ORDER =================
router.delete(
  "/:id",
  authMiddleware.authusermiddleware,
  orderController.deleteOrder,
);

// ================= GET MY ORDERS =================
router.get(
  "/my",
  authMiddleware.authusermiddleware,
  orderController.getMyOrders,
);

module.exports = router;
