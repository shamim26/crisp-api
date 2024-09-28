const errorResponse = (
  res,
  { statusCode = 500, message = "Internal Server Error", ...args }
) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
    ...args,
  });
};

const successResponse = (
  res,
  { statusCode = 200, message = "Success", ...args }
) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    ...args,
  });
};

module.exports = {
  errorResponse,
  successResponse,
};
