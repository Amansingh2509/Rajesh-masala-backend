const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
    required: true,
  },

  price: {
    type: String,
    required: true,
  },
});

const itemModel = mongoose.model("item", itemSchema);
module.exports = itemModel;
