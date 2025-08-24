import asyncHandler from "../../utils/asyncHandler";
import { Response } from "express";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import User from "../../models/user.model";
import { successResponse, errorResponse } from "../responseController";
import { generateAccessAndRefreshToken } from "../../helper/generateTokens";

const guestLogin = asyncHandler(async (req: RequestWithUser, res: Response) => {
  // Find the guest user in the database
  const guestUser = await User.findOne({ role: "guest" });

  if (!guestUser) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Guest user not found. Please contact administrator.",
    });
  }

  if (guestUser.isBanned) {
    return errorResponse(res, {
      statusCode: 403,
      message: "Guest account has been disabled. Please contact support.",
    });
  }

  // Generate tokens for the guest user
  const tokens = await generateAccessAndRefreshToken(guestUser._id);

  if (!tokens) {
    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to generate tokens.",
    });
  }

  const { accessToken, refreshToken } = tokens;

  // Get guest user data without sensitive information
  const loggedGuestUser = await User.findById(guestUser._id).select(
    "-password -refreshToken"
  );

  // Set cookies with same configuration as regular login
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 4 * 60 * 60 * 1000, // 4 hours to match JWT expiry
    secure: true,
    sameSite: "none",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days to match JWT expiry
    secure: true,
    sameSite: "none",
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Guest login successful",
    payload: {
      user: loggedGuestUser,
      accessToken,
      refreshToken,
    },
  });
});

export default guestLogin;
