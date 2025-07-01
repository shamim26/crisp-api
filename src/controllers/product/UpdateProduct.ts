import { Request, Response } from "express";
import Product from "../../models/product.model";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";

const UpdateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

  if (!product) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Product not found",
    });
  }

  successResponse(res, {
    statusCode: 200,
    message: "Product updated successfully",
    payload: product,
  });
});

export default UpdateProduct;
