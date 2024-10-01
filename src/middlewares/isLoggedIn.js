const { verifyJwt } = require("../utils/jwt");
const { errorResponse } = require("../controllers/responseController");
const User = require("../models/user.model");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return errorResponse(res, {
        statusCode: 404,
        message: "User not found.",
      });
    }

    if (user.isBanned) {
      return errorResponse(res, {
        statusCode: 403,
        message: "Your account has been banned. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isLoggedIn;
