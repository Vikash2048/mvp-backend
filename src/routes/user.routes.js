import express from "express";
import { getAvatars, getUserProfile, logout, sendOTP, updateStreak, updateUserProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../utils/jwt.util.js";
import { userUpdateSchema, validateBody } from "../middlewares/validation.js";
import { refreshedAccessToken } from "../controllers/auth.controller.js"


const userRouter = express.Router();

userRouter.post("/send-otp", sendOTP);
userRouter.get("/avatars", getAvatars);
userRouter.get("/my-profile", authMiddleware, getUserProfile);
userRouter.put("/update-profile", authMiddleware, validateBody(userUpdateSchema), updateUserProfile);
userRouter.get("/logout", authMiddleware, logout);

userRouter.get("/update-streak", authMiddleware, updateStreak);
export default userRouter;