import { NextFunction, Request, Response } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { errorResponse } from "../controllers/responseController";

const blockGuest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const requestWithUser = req as RequestWithUser;

  if (requestWithUser.user?.role === "guest") {
    errorResponse(res, {
      statusCode: 403,
      message: "Guest users are not allowed to perform this action.",
    });
    return;
  }
  next();
};

export default blockGuest;
