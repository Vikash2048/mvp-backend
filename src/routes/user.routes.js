import express from "express";
import { getAvatars, getUserProfile, logout, refreshedAccessToken, sendOTP, updateStreak, updateUserProfile, verifyOTP } from "../controllers/user.controller.js";
import { authMiddleware } from "../utils/jwt.util.js";
import { userUpdateSchema, validateBody } from "../middlewares/validation.js";


const authRouter = express.Router();

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/refresh-token", refreshedAccessToken);
authRouter.get("/avatars", getAvatars);
authRouter.get("/my-profile", authMiddleware, getUserProfile);
authRouter.put("/update-profile", authMiddleware, validateBody(userUpdateSchema), updateUserProfile);
authRouter.get("/logout", authMiddleware, logout);

authRouter.get("/update-streak", authMiddleware, updateStreak);
export default authRouter;