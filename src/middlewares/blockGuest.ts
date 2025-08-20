import { NextFunction, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { errorResponse } from "../controllers/responseController";

const blockGuest = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "guest") {
    return errorResponse(res, {
      statusCode: 403,
      message: "Guest users are not allowed to access this resource",
    });
  }
  next();
};

export default blockGuest;
