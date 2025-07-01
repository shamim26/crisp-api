import { Request, Response } from "express";
import Product from "../../models/product.model";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";

const GetProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Product not found",
    });
  }

  successResponse(res, {
    statusCode: 200,
    message: "Product fetched successfully",
    payload: product,
  });
});

export default GetProduct;
