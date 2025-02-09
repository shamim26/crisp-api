import { Types } from "mongoose";
import User from "../models/user.model";

export const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Something went wrong!!", error);
  }
};
