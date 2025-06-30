import mongoose, { ValidatorProps } from "mongoose";

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
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid image URL!`,
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.every((url) =>
            /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url)
          );
        },
        message: () => `All image URLs must be valid!`,
      },
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    specifications: {
      type: [
        {
          key: String,
          value: String,
        },
      ],
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
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
