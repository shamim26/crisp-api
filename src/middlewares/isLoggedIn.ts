import { verifyJwt } from "../utils/jwt";
import { errorResponse } from "../controllers/responseController";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN } from "../constant";
import RequestWithUser from "../interfaces/requestWithUser.interface";

const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const requestWithUser = req as RequestWithUser;
  try {
    const token: string =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      errorResponse(res, {
        statusCode: 401,
        message: "Authentication required. Please log in.",
      });
      return;
    }

    const decoded = verifyJwt(token, ACCESS_TOKEN);

    if (!decoded) {
      errorResponse(res, {
        statusCode: 401,
        message: "Invalid or expired token. Please log in again.",
      });
      return;
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      errorResponse(res, {
        statusCode: 404,
        message: "User not found.",
      });
      return;
    }

    if (user.isBanned) {
      errorResponse(res, {
        statusCode: 403,
        message: "Your account has been banned. Please contact support.",
      });
      return;
    }

    requestWithUser.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isLoggedIn;
