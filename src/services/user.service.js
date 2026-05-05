import AppError from "../utils/AppError.js";
import { getExpiryTime } from "./otp.service.js";
import { isValidPhoneNumber } from "libphonenumber-js";
import { generate } from "otp-generator";
import * as otpRepo from "../repository/otp.respository.js";
import * as userRepo from "../repository/user.respository.js";
import bcrypt from "bcrypt";
import * as jwtService from "./jwt.service.js";

// SEND OTP
export const sendOTP = async({phone}) => {

    if (!phone || phone.length > 15) {  // we are sending full phone number including country code like +917011018266 
        throw new AppError("Correct phone number required!!", 400);
    }

    // Ensure E.164 format for India
    if (!isValidPhoneNumber(phone)){
        throw new AppError("Incorrect phone number", 400);
    }

    const otp = generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expireAt = getExpiryTime(5);

    // DB call
    const otpInsert = await otpRepo.upsertOtp(phone, hashedOtp, expireAt);

    // await client.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    return otp;  // for developement env only
};

// GETTING USER PROFILE
export const getUserProfile = async(userId) => {
    const user = await userRepo.findById(userId);
    if (!user){
        throw new AppError("User not found!", 404);
    }

    const userObj = user.toObject();
    delete userObj.refreshTokens;
    return userObj;
}

// UPDATE USER PROFILE
export const updateUserProfile = async(userId, updateData) => {
    const user = await userRepo.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    }

    const checkData = {
        name: updateData.name || user.name,
        gender: updateData.gender || user.gender,
        email: updateData.email || user.email,
        AlternateNumber: updateData.AlternateNumber || user.AlternateNumber,
        phone: user.phone, // phone is already required by schema
        date_of_birth: updateData.date_of_birth || user.date_of_birth,
    };

    const isNowComplete = Object.values(checkData).every( (val) => val !== undefined && val !== "" && val !== "User");

    const updateUser = await userRepo.updateById(userId, {
        ...updateData,
        profileCompleted: isNowComplete,
    });

    return updateUser;
}

// UPDATE STREAK
export const updateStreak = async(userId) => {
    const user = await userRepo.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if(!user.lastActivityDate){
        user.streak = 1;
    } else {
        const last = new Date(user.lastActivityDate);
        const lastMidnight = new Date(
            last.getFullYear(),
            last.getMonth(),
            last.getDate()
        );

        const diffDays = Math.ceil(Math.abs(today - lastMidnight) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) user.streak += 1;
        else if (diffDays > 1) user.streak = 1;

        if(user.streak > (user.highestStreak || 0)) {
            user.highestStreak = user.streak;
        }

        user.lastActivityDate = now;

        await user.save();
        return {
            streak: user.streak,
            highestStreak: user.highestStreak,
        };
    };
}

