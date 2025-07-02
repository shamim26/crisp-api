import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import Category from "../../models/category.model";
import { errorResponse, successResponse } from "../responseController";

const UpdateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, parentId },
    { new: true }
  );

  if (!category) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Category not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Category updated successfully",
    category,
  });
});

export default UpdateCategory;
