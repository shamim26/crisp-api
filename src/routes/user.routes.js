const express = require("express");
const registerUser = require("../controllers/authentication/Register");
const isLoggedIn = require("../middlewares/isLoggedIn");
const loginUser = require("../controllers/authentication/Login");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

module.exports = userRouter;
