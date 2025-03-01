const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tag: { type: [String], default: [] },
    // Assuming category is stored as a reference to the CateLogy model
    category: { type: mongoose.Schema.Types.ObjectId, ref: "CateLogy", required: true },
    description: { type: String, trim: true, default: "" },
    image: { type: [String], required: true, trim: true },
    star: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);