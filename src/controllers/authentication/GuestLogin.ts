import asyncHandler from "../../utils/asyncHandler";
import { Response } from "express";
import RequestWithUser from "../../interfaces/requestWithUser.interface";

const guestLogin = asyncHandler(async (req: RequestWithUser, res: Response) => {
  
});

export default guestLogin;