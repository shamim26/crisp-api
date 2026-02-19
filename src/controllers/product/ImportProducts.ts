import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { errorResponse, successResponse } from "../responseController";
import csv from "csv-parser";
import { Readable } from "stream";
import { generateSlug } from "../../helper/generateSlug";

const ImportProducts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Please upload a CSV file",
    });
  }

  const results: any[] = [];
  const stream = Readable.from(req.file.buffer.toString());

  stream
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const productsToInsert = [];

        for (const row of results) {
          const name = row.Name || row.name;
          if (!name) continue;

          const productData = {
            name,
            slug: generateSlug(name),
            description: row.Description || row.description || "No description",

            // TODO: Look up Category by Name if provided?

            category: row.Category || row.category,
            brand: row.Brand || row.brand,

            pricing: {
              basePrice: parseFloat(row.BasePrice || row.basePrice || "0"),
              compareAtPrice: parseFloat(
                row.CompareAtPrice || row.compareAtPrice || "0"
              ),
            },
            variants: [
              {
                sku: generateSlug(name) + "-default",
                price: parseFloat(row.BasePrice || row.basePrice || "0"),
                stock: parseInt(row.Stock || row.stock || "0"),
                options: [],
              },
            ],
            // Images: Comma separated URLs
            images: row.Images
              ? row.Images.split(",").map((s: string) => s.trim())
              : [],
            isFeatured: row.IsFeatured === "true",
          };

          productsToInsert.push(productData);
        }

        if (productsToInsert.length > 0) {
          // Insert many might fail if validation fails (e.g. invalid IDs)
          // We'll try to insert.
          await Product.insertMany(productsToInsert);
        }

        return successResponse(res, {
          statusCode: 201,
          message: `${productsToInsert.length} products imported successfully`,
        });
      } catch (error: any) {
        return errorResponse(res, {
          statusCode: 500,
          message: "Failed to import products: " + error.message,
        });
      }
    });
});

export default ImportProducts;
