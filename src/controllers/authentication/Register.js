const { successResponse, errorResponse } = require("../responseController");
const User = require("../../models/user.model");
const { createJwt } = require("../../utils/jwt");
const { jwtSecret } = require("../../constant");
const asyncHandler = require("../../utils/asyncHandler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Email already exists.",
    });
  }

  const newUser = {
    name,
    email,
    password,
  };

  const user = await User.create(newUser);

  const token = createJwt({ id: user._id }, jwtSecret, "1d");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return successResponse(res, {
    statusCode: 200,
    message: "Registered Successfully.",
    payload: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

module.exports = registerUser;
