import jwt from "jsonwebtoken";
import bcrpyt from "bcrypt";
import RefreshToken from "../../models/refreshToken.model.js";
import { generateTokens } from "./token.service.js";
import { createLogger } from "../../utils/logger.js";

const logger = createLogger({ module: "auth", feature: "refresh-token" });

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    logger.info({
        functionName: "refreshAccessToken",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip
    }, "Auth refresh token handler hit");

    if (!refreshToken) {
        logger.failure("Refresh token missing from request", null, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip
        });
        return res.status(401).json({ message: "Refresh token required" });
    }

    let payload;

    try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }
    catch (err) {
        logger.failure("Invalid refresh token received", err, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip
        });
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokenDoc = await RefreshToken.findOne(
        {
            userId: payload.userId,
            revoked: false
        }
    );

    if (!tokenDoc) {
        logger.failure("Refresh session not found", null, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip,
            userId: payload.userId
        });
        return res.status(401).json({ message: "Session not found" });
    }

    const isValid = await bcrpyt.compare(refreshToken, tokenDoc.tokenHash);
    if (!isValid) {
        logger.failure("Refresh token hash mismatch", null, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip,
            userId: payload.userId
        });
        return res.status(401).json({ message: "Token mismatch" });
    }

    const tokens = await generateTokens(payload.userId);
    logger.info({
        functionName: "refreshAccessToken",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        userId: payload.userId
    }, "Access token refreshed successfully");

    return res.json(tokens);
};


