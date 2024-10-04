const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { apiVersion } = require("./constant");
const rootRouter = require("./routes/root.routes");
const userRouter = require("./routes/user.routes");
const categoryRouter = require("./routes/category.routes");
const productRouter = require("./routes/product.routes");
const morgan = require("morgan");
const { default: rateLimit } = require("express-rate-limit");

const app = express();


const limiterOption = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
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
app.use(rateLimit(limiterOption));

// routes
app.use(`${apiVersion}`, rootRouter);
app.use(`${apiVersion}/users`, userRouter);
app.use(`${apiVersion}/categories`, categoryRouter);
app.use(`${apiVersion}/products`, productRouter);



module.exports = { app };
