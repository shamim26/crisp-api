import Category from "../../models/category.model";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";
import { Request, Response } from "express";

const GetCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Category not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Category fetched successfully",
    category,
  });
});

export default GetCategory;
