import { successResponse, errorResponse } from "../responseController";
import User from "../../models/user.model";
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

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return successResponse(res, {
    statusCode: 200,
    message: "Registered Successfully.",
    payload: {
      createdUser,
    },
  });
});

export default registerUser;
