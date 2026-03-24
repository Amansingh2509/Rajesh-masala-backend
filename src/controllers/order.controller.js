const Order = require("../models/order.model");
const Item = require("../models/items.model");
const nodemailer = require("nodemailer");

// ================= CREATE ORDER =================
async function createOrder(req, res) {
  try {
    const cartItems = req.body.items;

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new Order({
      user: req.user._id,
      userName: req.user.fullname,
      items: cartItems,
      totalAmount,
      status: "pending",
    });

    await order.save();

    console.log(`New Order #${order._id} Total: ₹${totalAmount}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// ================= GET ALL ORDERS =================
async function getOrders(req, res) {
  try {
    let query = { status: { $ne: "deleted" } }; // Optional: exclude deleted

    // Owner filter
    if (req.itemOwner) {
      const Item = require("../models/items.model");
      const ownerItemIds = await Item.find({
        owner: req.itemOwner._id,
      }).distinct("_id");
      if (ownerItemIds.length === 0) {
        return res.json({ success: true, orders: [] });
      }
      query["items.itemId"] = { $in: ownerItemIds };
    }

    const orders = await Order.find(query)
      .populate("user", "fullname email address")
      .populate("items.itemId", "name price owner")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// ================= UPDATE ORDER STATUS =================
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const validStatuses = ["pending", "accepted", "delivered", "not-available"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(id).populate("user", "email fullname");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Decrease inventory on delivered
    if (status === "delivered") {
      for (const orderItem of order.items) {
        const itemId = orderItem.itemId || orderItem._id; // Flexible ID
        if (itemId) {
          const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $inc: { quantity: -orderItem.quantity } },
            { new: true },
          );
          if (updatedItem.quantity < 0) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${orderItem.productName}`,
            });
          }
        }
      }
    }

    order.status = status;
    await order.save();

    // Optional email to user
    // (You can add nodemailer logic here if needed)

    res.json({
      success: true,
      message: `Status updated to ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// ================= GET MY ORDERS =================
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// ================= DELETE ORDER =================
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({
      _id: id,
      user: req.user._id,
      status: "pending",
    });
    if (!order) {
      return res.status(404).json({ message: "Pending order not found" });
    }
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getMyOrders,
  deleteOrder,
};
