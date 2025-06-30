import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiVersion } from "./constant";
import rootRouter from "./routes/root.routes";
import userRouter from "./routes/user.routes";
import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import suggestionRouter from "./routes/suggestion.routes";
import syncJob from "./jobs/syncJob";

const app = express();

const limiterOption = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
};

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(rateLimit(limiterOption)); TODO: Only in production

// routes
app.use(`${apiVersion}`, rootRouter);
app.use(`${apiVersion}/users`, userRouter);
app.use(`${apiVersion}/categories`, categoryRouter);
app.use(`${apiVersion}/products`, productRouter);
app.use(`${apiVersion}/suggestions`, suggestionRouter);

// sync job
// syncJob();

export { app };
