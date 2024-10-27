import { successResponse, errorResponse } from "../responseController";
import User from "../../models/user.model";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { Types } from "mongoose";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existingUser) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email or Username already exists.",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

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
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Registered Successfully.",
    payload: {
      user: loggedUser,
      accessToken,
      refreshToken,
    },
  });
});

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
};

export default registerUser;
