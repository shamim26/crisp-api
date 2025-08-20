import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import User, { UserDocument } from "../../models/user.model";

const getProfile = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const user = req.user as UserDocument;
  const userData = await User.findById(user._id).select("-password -refreshToken");

  if (!userData) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    payload: {
      user: userData,
    },
  });
});

export default getProfile;
