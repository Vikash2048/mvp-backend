import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import * as userRepo from "../repository/user.respository.js";

dotenv.config({ path: ".env" });

export const authMiddleware = async (req, res, next) => {
    try{
        let token;
        // get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token){
            throw new AppError("Not authorized. No token provided.", 401);
        }

        //verify token
        let decoded;
        try{
            decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            throw new AppError("Invalid or expired token", 401);
        }

        //fetch user
        const user = await userRepo.findById(decoded.id);

        if(!user){
            throw new AppError("User not found", 401);
        }

        req.user = user;

        req.log.info({userId: user._id,}, "User authenticated");

        next();
    } catch (err) {
        next(err); // send to global errorhandler
    }
}