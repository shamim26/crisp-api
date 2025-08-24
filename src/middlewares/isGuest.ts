import { NextFunction, Request, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { errorResponse } from "../controllers/responseController";
import { UserDocument } from "../models/user.model";

const isGuest = (req: Request, res: Response, next: NextFunction): void => {
  const requestWithUser = req as RequestWithUser;
  const user = requestWithUser.user as UserDocument;
  if (user?.role !== "guest") {
    errorResponse(res, {
      statusCode: 403,
      message: "Only guest users are allowed to access this resource",
    });
    return;
  }
  next();
};

export default isGuest;
