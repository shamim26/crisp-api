import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
   
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
