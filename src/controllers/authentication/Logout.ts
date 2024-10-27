import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import User from "../../models/user.model";
import { successResponse } from "../responseController";

const logout = asyncHandler(
  async (
    req: Request & { user?: { _id: string } },
    res: Response,
    next: NextFunction
  ) => {
    const id = req.user?._id;

    await User.findByIdAndUpdate(
      id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true }
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  }
);

export default logout;
