import multer from "multer";
import AppError from "../utils/AppError.js";

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return next(new AppError("File too large. Max 2MB allowed", 400));
        }
    }

    next(err);
};