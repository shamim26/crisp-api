import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Category from "../../models/category.model";
import { errorResponse, successResponse } from "../responseController";

const CreateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, parentId } = req.body;

  const category = await Category.create({ name, parentId });

  return successResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    category,
  });
});

export default CreateCategory;
