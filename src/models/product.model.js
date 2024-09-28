const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: Array,
    },
    colors: {
      type: Array,
    },
    price: {
      type: Number,
      required: true,
      default: 1000,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
