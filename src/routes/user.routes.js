import express from "express";
import { getAvatars, getUserProfile,sendOTP, updateStreak, updateUserProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userUpdateSchema, validateBody } from "../middlewares/validation.js";
import { refreshedAccessToken } from "../controllers/auth.controller.js"


const userRouter = express.Router();

userRouter.post("/send-otp", sendOTP);
userRouter.get("/avatars", getAvatars);
userRouter.get("/my-profile", authMiddleware, getUserProfile);
userRouter.put("/update-profile", authMiddleware, validateBody(userUpdateSchema), updateUserProfile);

userRouter.get("/update-streak", authMiddleware, updateStreak);
export default userRouter;