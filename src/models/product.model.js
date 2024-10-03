const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.every((url) =>
            /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url)
          );
        },
        message: () => `All image URLs must be valid!`,
      },
    },
    brand: {
      type: String,
    },
    size: {
      type: [String],
      required: [true, "Size is required"],
    },
    colors: {
      type: [String],
      required: [true, "Colors are required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 1000,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
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
