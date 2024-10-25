import { Request, Response } from "express";
import User from "../../models/user.model";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findById(id);

  if (!user) {
    return errorResponse(res, { statusCode: 404, message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  return successResponse(res, {
    statusCode: 200,
    message: "User updated successfully.",
    payload: {
      user: updatedUser,
    },
  });
});

export default updateUser;
