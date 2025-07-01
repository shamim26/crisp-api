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
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    specifications: {
      type: [
        {
          key: String,
          value: String,
        },
      ],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
    },
    colors: {
      type: [String],
    },
    keyFeatures: {
      type: [String],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    offerPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },
    warranty: {
      type: String,
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
