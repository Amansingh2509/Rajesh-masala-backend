const storageService = require("../services/storage.service");
const itemModel = require("../models/items.model");

async function createitems(req, res) {
  try {
    const { name, description, price, category } = req.body;
    let imageUrl = null;

    // Upload file to ImageKit if file exists
    if (req.file) {
      const result = await storageService.uploadFile(
        req.file.buffer.toString("base64"),
        req.file.originalname,
      );
      imageUrl = result.url;
    }

    const newItem = await itemModel.create({
      name,
      image:
        imageUrl ||
        "https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=No+Image",
      category,
      price,
      description,
      owner: req.itemOwner._id,
    });

    res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating item",
      error: error.message,
    });
  }
}
async function getitems(req, res) {
  const items = await itemModel.find({}).populate("owner", "fullname");
  res.status(200).json({
    message: "food items fetched successfully",
    items,
  });
}

async function getOwnerItems(req, res) {
  try {
    const items = await itemModel
      .find({ owner: req.itemOwner._id })
      .populate("owner", "fullname");
    res.status(200).json({
      message: "Owner items fetched successfully",
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching owner items",
      error: error.message,
    });
  }
}

async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.file) {
      const result = await storageService.uploadFile(
        req.file.buffer.toString("base64"),
        req.file.originalname,
      );
      updateData.image = result.url;
    }

    const updatedItem = await itemModel
      .findOneAndUpdate({ _id: id, owner: req.itemOwner._id }, updateData, {
        new: true,
        runValidators: true,
      })
      .populate("owner", "fullname");

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    res.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating item",
      error: error.message,
    });
  }
}

async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const deletedItem = await itemModel.findOneAndDelete({
      _id: id,
      owner: req.itemOwner._id,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    res.json({
      message: "Item deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting item",
      error: error.message,
    });
  }
}

module.exports = {
  createitems,
  getitems,
  getOwnerItems,
  updateItem,
  deleteItem,
};
