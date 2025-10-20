import mongoose, { Document, Model, Schema, ValidatorProps } from "mongoose";
import { generateSlug } from "../helper/generateSlug";

// --- Sub-schema for Product Variants ---
const variantSchema = new Schema({
  sku: {
    type: String,
    required: [true, "Variant SKU is required"],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Variant price is required"],
    min: [0, "Price cannot be negative"],
  },
  stock: {
    type: Number,
    required: [true, "Variant stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  // Example: [{ option_name: 'Color', option_value: 'Space Gray' }, { option_name: 'Storage', option_value: '512GB' }]
  options: [
    {
      option_name: { type: String, required: true },
      option_value: { type: String, required: true },
    },
  ],
});

// --- Main Product Schema ---
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // Slug will be auto-generated before saving
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    // --- Organization ---
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    tags: [String],

    // --- Media ---
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
    // --- Pricing (Base pricing info) ---
    pricing: {
      // This price can be a baseline, but the variant price is what's used for purchase
      basePrice: { type: Number, default: 0 },
      compareAtPrice: { type: Number, default: 0 }, // For showing discounts
    },

    // --- Variants ---
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (v: any[]) {
          return v.length > 0;
        },
        message: "Product must have at least one variant.",
      },
    },

    // --- Specifications ---
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

    warranty: {
      type: String,
    },

    // // --- SEO ---
    // seo: {
    //   title: { type: String },
    //   metaDescription: { type: String },
    // },

    // --- Flags ---
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      // For soft deletes
      type: Boolean,
      default: false,
      select: false, // Hide by default from queries
    },
  },
  { timestamps: true }
);

// --- Middleware (Hooks) ---

// 1. Auto-generate slug from the name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
