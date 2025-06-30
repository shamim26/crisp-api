import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { successResponse } from "../responseController";
import Suggestion from "../../models/suggestion.model";

const getSuggestion = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;

  const suggestions = await Suggestion.find({
    productName: { $regex: search, $options: "i" },
  });

  const totalSuggestions = await Suggestion.countDocuments();

  successResponse(res, {
    message: "Suggestions fetched successfully",
    payload: {
      suggestions,
      totalSuggestions,
    },
  });
});

export default getSuggestion;
