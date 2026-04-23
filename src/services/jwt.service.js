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

export const verifyToken = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}

