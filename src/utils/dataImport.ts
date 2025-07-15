import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import Product from "../models/product.model";
import generateSlug from "./generateSlug";

const dataImport = async () => {
  const results: any[] = [];
  const topLevelFields = [
    "name",
    "description",
    "featuredImage",
    "slug",
    "price",
    "stock",
    "model",
    "rating",
  ];

  fs.createReadStream("./public/smartphones - smartphones.csv")
    .pipe(csv())
    .on("data", (row) => {
      const specifications: Record<string, string> = {};

      const slug = generateSlug(row.model);

      const product: any = {
        name: row.model || "",
        description: "",
        featuredImage: "",
        slug: slug,
        price: 0,
        stock: 1,
        brand: null,
        category: null,
        images: [],
        offerPrice: undefined,
        colors: [],
        keyFeatures: [],
        warranty: "",
        isFeatured: false,
        isDeleted: false,
        specifications,
      };

      for (const [key, value] of Object.entries(row)) {
        if (topLevelFields.includes(key)) {
          if (key === "price") {
            const clean =
              typeof value === "string" ? value.replace(/[^\d]/g, "") : "";
            const numericPrice = parseInt(clean, 10);
            product.price = isNaN(numericPrice) ? 0 : numericPrice;
          } 
        } else {
          specifications[key] = value?.toString() ?? "";
        }
      }
      results.push(product);
    })

    .on("end", async () => {
      try {
        //   await Product.insertMany(results);
        console.log("Products imported successfully!", results);
      } catch (err) {
        console.error("Import failed:", err);
      } finally {
        mongoose.connection.close();
      }
    });
};

export default dataImport;
