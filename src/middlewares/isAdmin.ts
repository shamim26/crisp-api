import { Request, Response, NextFunction } from "express";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { errorResponse } from "../controllers/responseController";

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const requestWithUser = req as RequestWithUser;
    const { user } = requestWithUser;

    if (user.role !== "admin") {
      errorResponse(res, { statusCode: 403, message: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isAdmin;
