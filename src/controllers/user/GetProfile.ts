import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";
import RequestWithUser from "../../interfaces/requestWithUser.interface";


const getProfile = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const user = req.user;

//   const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    payload: {
      user,
    },
  });
});

export default getProfile;
