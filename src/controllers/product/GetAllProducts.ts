import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { errorResponse, successResponse } from "../responseController";

const GetAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search ? String(req.query.search) : "";

  let filter: any = {};

  if (search) {
    filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
  }

  const products = await Product.find(filter).skip(skip).limit(limit);
  if (!products) {
    return errorResponse(res, {
      statusCode: 404,
      message: "No products found",
    });
  }

  const total = await Product.countDocuments(filter);

  successResponse(res, {
    statusCode: 200,
    message: "Products fetched successfully",
    payload: {
      products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    },
  });
});

export default GetAllProducts;
