import twilio from "twilio";
import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import otpModel from "../models/otp.model.js";
import Avatar from "../models/avatar.model.js";
import { UserDefinedMessageInstance } from "twilio/lib/rest/api/v2010/account/call/userDefinedMessage.js";
import { createLogger } from "../utils/logger.js";
import { catchAsync } from "../utils/catchAsync.js";
import * as userService from "../services/user.service.js";
import * as jwtService from "../services/jwt.service.js";
import * as avatarService from "../services/avatar.service.js";
import AppError from "../utils/AppError.js";
dotenv.config({ path: "./src/config/.env" });

const client = twilio( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );

const router = express.Router();
const logger = createLogger({ module: "user-controller" });

/* SEND OTP */

const sendOTP = catchAsync(async(req, res, next) => {
  req.log.info("Send OTP request received");
  const result = await userService.sendOTP(req.body);
  req.log.info("OTP sent successfully");

  res.status(200).json({
    success: true,
    data: result,  // for dev purpose only remove it in production
    message: "OTP sent successfully",
    requestId: req.requestId,
  });
})

/* GENERATE RANDOM AVATAR FROM DICEBEAR */  
const getAvatarOptions = catchAsync(async(req, res, next) => {
  req.log.info("Get avatar options request received");
  const avatar = await avatarService.getAvatarOptions();
  res.status(200).json({ success: true, data: avatar})
});

/* SELECT AVATAR FRM DICEBEAR */
const selectAvatar = catchAsync(async(req, res, next) => {
  req.log.info("Avatar selection request received");
  const {seed, style} = req.body;
  await avatarService.selectAvatar(req.user.id, seed, style);
  res.status(200).json({success: true, message: "Avatar selected"});
})

/* UPLOAD CUSTOM IMAGE */
const uploadAvatar = catchAsync(async(req, res, next) => {
  req.log.info("Avatar upload request received");

  if(!req.file){
    throw new AppError("No file uploaded, image is missing", 400);
  }

  const imageUrl  = req.file;
  await avatarService.uploadAvatar(req.user.id, imageUrl);
  res.status(200).json({success: true, message: "Avatar uploaded"});
})

/* REMOVE AVATAR */
const removeAvatar = catchAsync(async(req, res, next) => {
  req.log.info("Avatar remove request received");
  await avatarService.removeAvatar(req.user.id);
  res.status(200).json({success: true, message: "Avatar removed"});
})

/* USER PROFILE */
const getUserProfile = catchAsync(async(req, res, next) => {
  req.log.info("Get profile hit");
  const user = await userService.getUserProfile(req.user.id);
  res.status(200).json({success: true, data: user});
});

/* UPDATE USER PROFILE */
const updateUserProfile = catchAsync(async(req, res, next) => {
  req.log.info("User profile update request received");
  const user = await userService.updateUserProfile(req.user.id, req.body);
  res.status(200).json({success: true, data: user});
});

/* UPDATE STREAK */
const updateStreak = catchAsync(async(req, res, next) => {
  req.log.info("Update streak request received");
  const data = await userService.updateStreak(req.user.id);
  res.status(200).json({success: true, data});
});


/*
const getUserProfile = async (req, res) => {
  try {
    logger.info({
      functionName: "getUserProfile",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get user profile handler hit");
    // req.user.id comes from your verifyToken middleware
    const user = await User.findById(req.user.id).select("-refreshTokens");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.failure("Fetching user profile failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    logger.info({
      functionName: "updateUserProfile",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Update user profile handler hit");
    const updateData = req.body;
    // 1. Get the current user to see what's already there
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // 2. Merge current data with the new updates to check completion
    const checkData = {
      name: updateData.name || user.name,
      gender: updateData.gender || user.gender,
      email: updateData.email || user.email,
      AlternateNumber: updateData.AlternateNumber || user.AlternateNumber,
      phone: user.phone, // Phone is already required by schema
      date_of_birth: updateData.date_of_birth || user.date_of_birth,
    };
    
    // 3. Logic: Only set true if ALL these fields exist and aren't empty
    const isNowComplete = Object.values(checkData).every(
      (val) =>
        val !== undefined && val !== null && val !== "" && val !== "User",
    );
    
    // 4. Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...updateData,
          profileCompleted: isNowComplete,
        },
      },
      { new: true, runValidators: true },
    ).select("-refreshTokens");
    
    res.status(200).json({
      message: isNowComplete
      ? "Profile Completed!"
      : "Profile Updated (Incomplete)",
      user: updatedUser,
    });
  } catch (error) {
    logger.failure("Updating user profile failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateStreak = async (req, res) => {
  try {
    logger.info({
      functionName: "updateStreak",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Update streak handler hit");
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!user.lastActivityDate) {
      user.streak = 1;
    } else {
      const lastDate = new Date(user.lastActivityDate);
    const lastActivityMidNight = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
    );
    
    // Calculate difference in days
    const diffTime = Math.abs(today - lastActivityMidNight);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // It's the very next day
      user.streak += 1;
    } else if (diffDays > 1) {
      // They missed a day or more
      user.streak = 1;
    }
    // If diffDays is 0, they already did their activity today
  }
  
  // Update Highest Streak record
  if (user.streak > (user.highestStreak || 0)) {
    user.highestStreak = user.streak;
  }
  
  user.lastActivityDate = now;
  await user.save();
  
  return res.status(200).json({
    success: true,
    message: "Streak updated successfully",
    streak: user.streak,
    highestStreak: user.highestStreak,
  });
} catch (error) {
  logger.failure("Updating streak failed", error, {
    method: req.method,
    endpoint: `${req.method} ${req.originalUrl}`,
    ip: req.ip,
  });
  return res.status(500).json({
    success: false,
    message: "Internal server error while updating streak",
    error: error.message,
  });
}
};

*/

export { sendOTP, updateUserProfile, getUserProfile, updateStreak , getAvatarOptions, selectAvatar, uploadAvatar};