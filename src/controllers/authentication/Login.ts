import User from "../../models/user.model";
import { successResponse, errorResponse } from "../responseController";
import bcrypt from "bcrypt";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { generateAccessAndRefreshToken } from "../../helper/generateTokens";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid password",
    });
  }

  if (user.isBanned) {
    return errorResponse(res, {
      statusCode: 403,
      message: "Your account has been banned. Please contact support.",
    });
  }

  const tokens = await generateAccessAndRefreshToken(user._id);

  if (!tokens)
    return errorResponse(res, {
      statusCode: 500,
      message: "Failed to generate tokens.",
    });

  const { accessToken, refreshToken } = tokens;

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

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
    message: "login successful",
    payload: {
      user: loggedUser,
      accessToken,
      refreshToken,
    },
  });
});

export default loginUser;
