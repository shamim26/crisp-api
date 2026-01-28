import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { initSocket } from "./utils/socket";

// Routes Import
// Routes Import
import productRouter from "./routes/product.routes";
import categoryRouter from "./routes/category.routes";
// import authRouter from "./routes/auth.routes"; // Missing
import userRouter from "./routes/user.routes";
// import brandRouter from "./routes/brand.routes"; // Missing
import suggestionRouter from "./routes/suggestion.routes";
// import dashboardRouter from "./routes/dashboard.routes"; // Missing
import orderRouter from "./routes/order.routes";

import syncJob from "./jobs/syncJob";
import dataImport from "./utils/dataImport";
import genText from "./utils/aiTextGenerator";

const app = express();

const httpServer = createServer(app);
initSocket(httpServer);

const limiterOption = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
};

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(rateLimit(limiterOption)); TODO: Only in production

// routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/suggestions", suggestionRouter);
// app.use("/dashboard", dashboardRouter);
app.use("/api/v1/orders", orderRouter);

app.route(`/api/v1/ai`).post(async (req, res) => {
  const prompt = req.body.prompt;
  const text = await genText(prompt);
  res.status(200).json({ text });
});

// sync job
// syncJob();

// data import
// dataImport();

export { app, httpServer };
