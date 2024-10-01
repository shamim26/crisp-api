const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { apiVersion } = require("./constant");
const rootRouter = require("./routes/root.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use(`${apiVersion}`, rootRouter);
app.use(`${apiVersion}/users`, userRouter);

module.exports = { app };
