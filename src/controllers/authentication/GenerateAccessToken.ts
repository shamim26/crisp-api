import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";
import { verifyJwt } from "../../utils/jwt";
import { REFRESH_TOKEN } from "../../constant";
import User from "../../models/user.model";
import { generateAccessAndRefreshToken } from "../../helper/generateTokens";

const generateAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Refresh token is required!",
      });
    }

    const decoded = verifyJwt(token, REFRESH_TOKEN);

    if (!decoded) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid or expired refresh token.",
      });
    }

    const user = await User.findById(decoded?._id);

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Invalid refresh token.",
      });
    }

    if (token !== user?.refreshToken) {
      return errorResponse(res, {
        statusCode: 403,
        message: "Refresh token is expired or used.",
      });
    }

    const tokens = await generateAccessAndRefreshToken(user?._id);
    if (!tokens)
      return errorResponse(res, {
        statusCode: 500,
        message: "Failed to generate tokens.",
      });

    const { accessToken, refreshToken } = tokens;

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      maxAge: 4 * 60 * 60 * 1000, // 4 hours to match JWT expiry
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days to match JWT expiry
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Access token generated successfully.",
      payload: {
        accessToken,
        refreshToken,
      },
    });
  }
);

export default generateAccessToken;
