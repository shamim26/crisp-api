import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Category from "../../models/category.model";
import { errorResponse, successResponse } from "../responseController";
const DeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Category not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Category deleted successfully",
    category,
  });
});

export default DeleteCategory;
