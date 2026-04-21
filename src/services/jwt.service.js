import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userRepo from "../repository/user.respository.js";

dotenv.config({ path: "./src/config/.eng"});

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY,});
};

export const authenticateRefreshToken = async(refreshToken) => {
    let decode;

    try{
        decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    } catch(err){
        throw new AppError("Refresh token expired or invalid!!");
    }

    const user = await userRepo.findById(decode.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
        throw new AppError("Invalid refresh token", 403);
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
}