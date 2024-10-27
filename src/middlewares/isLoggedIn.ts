import { verifyJwt } from "../utils/jwt";
import { errorResponse } from "../controllers/responseController";
import User from "../models/user.model";
import { NextFunction, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { ACCESS_TOKEN } from "../constant";

const isLoggedIn = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = verifyJwt(token, ACCESS_TOKEN);

    if (!decoded) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found.",
      });
    }

    if (user.isBanned) {
      return errorResponse(res, {
        statusCode: 403,
        message: "Your account has been banned. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isLoggedIn;
