import jwt from "jsonwebtoken";
import { createLogger } from "../../utils/logger.js";

const logger = createLogger({ module: "auth-user-check-middleware" });

const userCheck = (req, res, next) => {
    logger.info({
        functionName: "userCheck",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip
    }, "Auth user check middleware hit");
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userId == payload.userId;
        next();
    }
    catch (err) {
        logger.failure("Auth user check failed", err, {
            functionName: "userCheck",
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip
        });
        return res.status(401).json({message: "Token expired or invalid"});
    }
};
