const Order = require("../models/order.model");
const nodemailer = require("nodemailer");
const userModel = require("../models/user.model");

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
    });

    await order.save();

    // Email to owner (blank for now)
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail) {
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.OWNER_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.OWNER_EMAIL,
        to: process.env.OWNER_EMAIL,
        subject: `New Order #${order._id} - ₹${totalAmount}`,
        html: `
          <h2>New Order from ${req.user.fullname}</h2>
          <p><strong>Total:</strong> ₹${totalAmount}</p>
          <h3>Items:</h3>
          <ul>
            ${cartItems.map((item) => `<li>${item.productName} x${item.quantity} - ₹${item.price * item.quantity}</li>`).join("")}
          </ul>
          <p>Order ID: ${order._id}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log(
        "Order #",
        order._id,
        "- Items:",
        cartItems,
        "- Total: ₹",
        totalAmount,
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      total: totalAmount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Order creation failed", error: error.message });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .select("userName items totalAmount status createdAt")
      .sort({ createdAt: -1 });
    console.log("Orders found:", orders.length);
    res.json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("getOrders error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
}

module.exports = { createOrder, getOrders };
