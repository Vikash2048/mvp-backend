import { createLogger } from "../utils/logger.js";

export const attachLogger = (req, res, next) => {
    req.log = createLogger({
        requestId: req.requestId,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
    });

    next();
}