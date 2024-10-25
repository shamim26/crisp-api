import { verifyJwt } from "../utils/jwt";
import { errorResponse } from "../controllers/responseController";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

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
