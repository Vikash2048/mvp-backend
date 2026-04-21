import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { createLogger } from "../../utils/logger.js";

const logger = createLogger({ module: "auth-middleware" });

const authMiddleware = async ( req, res, next ) => {
    try {
        logger.info({
            functionName: "authMiddleware",
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip
        }, "Auth middleware hit");
        const authHeader = req.header.authorization;

        if (!authHeader || !authHeader.startsWith("Beared ")) {
            return res.status(401).json({ message: "Unauthorized User"});
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).json({ message: "user not found"});
        }

        req.user = user;
        next();
    }
    catch (err) {
        logger.failure("Error verifying token", err, {
            method: req.method,
            endpoint: `${req.method} ${req.originalUrl}`,
            ip: req.ip
        });
        return res.status(401).json({ message: "Invalid or expired token"});
    }
};

export default authMiddleware;
