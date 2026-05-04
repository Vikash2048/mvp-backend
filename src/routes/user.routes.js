import express from "express";
import { getUserProfile,sendOTP, updateStreak, updateUserProfile, getAvatarOptions, selectAvatar, uploadAvatar} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userUpdateSchema, validateBody } from "../middlewares/validation.js";
import { refreshedAccessToken } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.middleware.js";


const userRouter = express.Router();

userRouter.post("/send-otp", sendOTP);
userRouter.get("/avatars", getAvatarOptions);
userRouter.get("/avatars/select", selectAvatar);
userRouter.post("/avatars/upload", authMiddleware, upload.single("avatar"), uploadAvatar);
userRouter.get("/my-profile", authMiddleware, getUserProfile);
userRouter.put("/update-profile", authMiddleware, validateBody(userUpdateSchema), updateUserProfile);
userRouter.get("/update-streak", authMiddleware, updateStreak);
export default userRouter;