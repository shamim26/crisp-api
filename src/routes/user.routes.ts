import express from "express";
import registerUser from "../controllers/authentication/Register";
import isLoggedIn from "../middlewares/isLoggedIn";
import loginUser from "../controllers/authentication/Login";
import updateUser from "../controllers/user/UpdateUser";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/:id", updateUser);

export default userRouter;
