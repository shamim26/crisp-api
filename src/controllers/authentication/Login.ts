import User from "../../models/user.model";
import { successResponse, errorResponse } from "../responseController";
import bcrypt from "bcrypt";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response } from "express";

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

  // res.cookie("jwt", token, {
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "none",
  // });

  return successResponse(res, {
    statusCode: 200,
    message: "login successful",
    payload: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

export default loginUser;
