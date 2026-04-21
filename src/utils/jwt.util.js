import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createLogger } from "./logger.js";

dotenv.config({ path: "./src/config/.env" });

const logger = createLogger({ module: "jwt-util" });

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  return token;
};

export const authMiddleware = (req, res, next) => {
  logger.info({
    functionName: "authMiddleware",
    method: req.method,
    endpoint: `${req.method} ${req.originalUrl}`,
    ip: req.ip,
  }, "JWT auth middleware hit");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from "Bearer TOKEN"
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.failure("Access token verification failed", err, {
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      });
      return res.status(403).json({ message: "Token expired or invalid" });
    }
    req.user = user;
    next();
  });
};

export const authenticateRefreshToken = ( res, req,user) => {
    logger.info({
      functionName: "authenticateRefreshToken",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Authenticate refresh token helper hit");
    const refreshToken = req.query.refreshToken;
  if (!refreshToken) return res.sendStatus(401);    
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          logger.failure("Refresh token verification failed", err, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip,
          });
          return res
            .status(403)
            .json({ message: "Refresh Token expired or invalid" });
        }

        // 4. Generate a new Access Token
        const accessToken = generateAccessToken(user);

        // 5. Return the new Access Token
        res.json({
          success: true,
          accessToken,
        });
      },
    );
};
