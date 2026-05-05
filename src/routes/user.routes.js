import express from "express";
import { getUserProfile,sendOTP, updateStreak, updateUserProfile, getAvatarOptions, selectAvatar, uploadAvatar} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userUpdateSchema, validateBody } from "../middlewares/validation.js";
import { refreshedAccessToken } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";


const userRouter = express.Router();

userRouter.post("/send-otp", sendOTP);
userRouter.get("/avatars", getAvatarOptions);
userRouter.post("/avatars/select", authMiddleware, selectAvatar);
userRouter.post("/avatars/upload", authMiddleware, upload.single("avatar"), uploadAvatar);
userRouter.get("/me", authMiddleware, getUserProfile);
userRouter.patch("/me", authMiddleware, validateBody(userUpdateSchema), updateUserProfile);
userRouter.post("/streak", authMiddleware, updateStreak);
export default userRouter;