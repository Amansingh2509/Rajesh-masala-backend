const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "item",
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userName: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
