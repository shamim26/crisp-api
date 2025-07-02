import express from "express";
import {
  errorResponse,
  successResponse,
} from "../controllers/responseController";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  successResponse(res, {
    statusCode: 200,
    message: "Welcome to the Crisp API",
    payload: {
      description:
        "This API provides endpoints for managing an e-commerce website.",
      version: "1.0",
      documentation: "/api/v1/Readme.md",
      currentTime: new Date().toDateString(),
    },
  });
});

rootRouter.get("/Readme.md", (req, res) => {
  const readmePath = path.join(process.cwd(), "Readme.md");
  fs.readFile(readmePath, "utf8", (err, data) => {
    if (err) {
      return errorResponse(res, {
        statusCode: 500,
        message: "Failed to read Readme.md",
      });
    }
    const html = marked(data);
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <html>
        <head>
          <title>Crisp API - Documentation | Readme.md</title>
          <meta charset="utf-8" />
          <style>
            body { max-width: 800px; margin: 2rem auto; font-family: Arial, sans-serif; }
            pre, code { background: #f6f8fa; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
  });
});

export default rootRouter;
