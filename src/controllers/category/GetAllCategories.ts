import Category from "../../models/category.model";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../responseController";

const GetAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;

  const categories = await Category.find({
    name: { $regex: search, $options: "i" },
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCategories = await Category.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);

  return successResponse(res, {
    statusCode: 200,
    message: "Categories fetched successfully",
    payload: {
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
      },
    },
  });
});

export default GetAllCategories;
