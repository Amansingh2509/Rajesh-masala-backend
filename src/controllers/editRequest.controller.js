const EditRequest = require("../models/editRequest.model");
const Order = require("../models/order.model");
const Item = require("../models/items.model");
const itemController = require("./items.controller");

async function submitEditRequest(req, res) {
  try {
    const { orderId, orderItemIndex, proposedChanges } = req.body;

    // Validate order exists, is pending, belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      status: "pending",
    });
    if (!order) {
      return res.status(404).json({ message: "Valid pending order not found" });
    }

    if (orderItemIndex < 0 || orderItemIndex >= order.items.length) {
      return res.status(400).json({ message: "Invalid order item index" });
    }

    const itemId =
      order.items[orderItemIndex]._id || order.items[orderItemIndex].itemId; // Flexible

    // Validate non-empty changes
    if (!proposedChanges.quantity && !proposedChanges.notes?.trim()) {
      return res
        .status(400)
        .json({ message: "Provide at least one change (quantity or notes)" });
    }

    const editRequest = new EditRequest({
      orderId,
      orderItemIndex,
      itemId,
      user: req.user._id,
      proposedChanges,
    });

    await editRequest.save();

    // Apply changes to order for immediate UI update
    order.items[orderItemIndex].quantity =
      proposedChanges.quantity || order.items[orderItemIndex].quantity;
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    await order.save();

    res.status(201).json({
      message: "Edit request submitted and order updated successfully",
      requestId: editRequest._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting request", error: error.message });
  }
}

async function getOwnerEditRequests(req, res) {
  try {
    const requests = await EditRequest.find({ status: "pending" })
      .populate("orderId", "items totalAmount createdAt userName")
      .populate("user", "fullname")
      .populate("itemId", "name price owner")
      .sort({ createdAt: -1 });

    // Filter for owner's items only
    const ownerItemsIds = await Item.find({
      owner: req.itemOwner._id,
    }).distinct("_id");
    const ownerRequests = requests.filter((req) =>
      ownerItemsIds.includes(req.itemId._id),
    );

    res.json({
      message: "Pending edit requests fetched",
      requests: ownerRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
}

async function reviewEditRequest(req, res) {
  try {
    const { id } = req.params;
    const { action, rejectReason } = req.body; // action: "approve" | "reject"

    const request = await EditRequest.findById(id).populate("itemId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Validate owner's item
    if (String(request.itemId.owner) !== String(req.itemOwner._id)) {
      return res.status(403).json({ message: "Not your item" });
    }

    if (action === "reject") {
      request.status = "rejected";
      request.rejectReason = rejectReason || "No reason provided";
    } else if (action === "approve") {
      // For now, log approval; extend to update item/order if needed
      // e.g. update order.items[orderItemIndex] or item stock
      request.status = "approved";
      console.log(
        `Approved edit request ${id} for item ${request.itemId.name}`,
      );
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();

    res.json({
      message: `Request ${action}d`,
      request,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reviewing request", error: error.message });
  }
}

module.exports = {
  submitEditRequest,
  getOwnerEditRequests,
  reviewEditRequest,
};
