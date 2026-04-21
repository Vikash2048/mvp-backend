import { createLogger } from "../utils/logger.js";

const logger = createLogger({ module: "globla_error_handler"});

const globalErrorHandler = (err, req, res, next) => {
    logger.error({
        module: "global-error-handler",
        requestId: req.requestId,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        err,
    }, "Request failed");

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        requestId: req.requestId,
    });
};

export { globalErrorHandler }