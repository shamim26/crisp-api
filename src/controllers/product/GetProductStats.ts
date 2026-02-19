import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { successResponse } from "../responseController";

const GetProductStats = asyncHandler(async (req: Request, res: Response) => {
  const totalProducts = await Product.countDocuments({ isDeleted: false });

  // Aggregate to calculate total stock per product
  const lowStockThreshold = 5;

  // We can use an aggregation to sum up stock from variants
  const lowStockCount = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $project: {
        totalStock: { $sum: "$variants.stock" },
      },
    },
    { $match: { totalStock: { $lte: lowStockThreshold, $gt: 0 } } },
    { $count: "count" },
  ]);

  const outOfStockCount = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $project: {
        totalStock: { $sum: "$variants.stock" },
      },
    },
    { $match: { totalStock: { $eq: 0 } } },
    { $count: "count" },
  ]);

  return successResponse(res, {
    statusCode: 200,
    message: "Product stats fetched successfully",
    payload: {
      totalProducts,
      lowStock: lowStockCount[0]?.count || 0,
      outOfStock: outOfStockCount[0]?.count || 0,
    },
  });
});

export default GetProductStats;
