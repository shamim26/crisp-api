const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const { errorResponse, successResponse } = require("../responseController");

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findById(id);

  if (!user) {
    return errorResponse(res, { statusCode: 404, message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  return successResponse(res, {
    statusCode: 200,
    message: "User updated successfully.",
    payload: {
      user: updatedUser,
    },
  });
});

module.exports = updateUser;
