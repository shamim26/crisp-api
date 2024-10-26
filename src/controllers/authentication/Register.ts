import { successResponse, errorResponse } from "../responseController";
import User from "../../models/user.model";
import { createJwt } from "../../utils/jwt";
import { jwtSecret } from "../../constant";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";

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

  const createdUser = await User.findById(user._id).select("-password");

  const token = createJwt({ id: user._id }, jwtSecret, "1d");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Registered Successfully.",
    payload: {
      createdUser,
    },
  });
});

const generateAccessRefreshToken = async (userId: string) => {
  try {
    const accessToken = createJwt({ id: userId }, jwtSecret);
    const refreshToken = createJwt({ id: userId }, jwtSecret);

    
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
};

export default registerUser;
