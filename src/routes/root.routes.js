const express = require("express");
const { successResponse } = require("../controllers/responseController");

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  successResponse(res, {
    statusCode: 200,
    message: "Welcome to the Crisp API",
    payload: {
      description:
        "This API provides endpoints for managing an e-commerce website.",
      version: "1.0",
      documentation: "/api/v1/readme.md", // Path to API documentation
      currentTime: new Date().toDateString(),
    },
  });
});

module.exports = rootRouter;
