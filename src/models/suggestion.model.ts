import mongoose from "mongoose";

export interface suggestionSchema {
  productName: string;
  brand: string;
  price: string;
  oldPrice: string;
  colors: string[];
  keyFeatures: string[];
  description: string;
  specifications: string[];
}

const suggestionSchema = new mongoose.Schema<suggestionSchema>(
  {
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    price: {
      type: String,
    },
    oldPrice: {
      type: String,
    },
    colors: {
      type: [String],
    },
    keyFeatures: {
      type: [String],
    },
    description: {
      type: String,
    },
    specifications: {
      type: [
        {
          key: String,
          value: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const Suggestion = mongoose.model<suggestionSchema>(
  "Suggestion",
  suggestionSchema
);

export default Suggestion;
