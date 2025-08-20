import { NextFunction, Request, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { errorResponse } from "../controllers/responseController";
import { UserDocument } from "../models/user.model";

const isGuest = (req: Request, res: Response, next: NextFunction) => {
  const requestWithUser = req as RequestWithUser;
  const user = requestWithUser.user as UserDocument;
  if (user?.role !== "guest") {
    return errorResponse(res, {
      statusCode: 403,
      message: "Only guest users are allowed to access this resource",
    });
  }
  next();
};

export default isGuest;