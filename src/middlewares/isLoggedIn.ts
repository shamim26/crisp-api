import { verifyJwt } from "../utils/jwt";
import { errorResponse } from "../controllers/responseController";
import User from "../models/user.model";
import { NextFunction, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";

const isLoggedIn = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.cookies.jwt;

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

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
