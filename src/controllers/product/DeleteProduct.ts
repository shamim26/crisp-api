import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { errorResponse, successResponse } from "../responseController";

const DeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Product not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Product deleted successfully",
    product,
  });
});

export default DeleteProduct;
