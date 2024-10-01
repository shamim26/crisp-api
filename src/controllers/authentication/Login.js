const User = require("../../models/user.model");
const { createJwt } = require("../../utils/jwt");
const { successResponse, errorResponse } = require("../responseController");
const bcrypt = require("bcrypt");
const asyncHandler = require("../../utils/asyncHandler");
const { jwtSecret } = require("../../constant");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, {
      statusCode: 404,
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid password",
    });
  }

  if (user.isBanned) {
    return errorResponse(res, {
      statusCode: 403,
      message: "Your account has been banned. Please contact support.",
    });
  }

  const token = createJwt({ userId: user._id }, jwtSecret, "1d");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return successResponse(res, {
    statusCode: 200,
    message: "login successful",
    payload: {
      user,
    },
  });
});

module.exports = loginUser;
