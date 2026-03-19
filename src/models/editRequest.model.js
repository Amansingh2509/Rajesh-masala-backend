const mongoose = require("mongoose");

const editRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderItemIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    proposedChanges: {
      quantity: {
        type: Number,
        min: 1,
      },
      notes: {
        type: String,
        maxlength: 500,
      },
      // Add price if needed later
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectReason: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("EditRequest", editRequestSchema);
