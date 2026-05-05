import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";

const limits = {
    fileSize: 2 * 1024 * 1024,
}

// const allowed_file_type = new Set([
//     "image/jpeg",
//     "image/png",
//     "image/webp",
// ]);

// const fileFilter = (req, file, cb) => {
//     if (!allowed_file_type.has(file.minetype)) {
//         return cb(new AppError("Only JPG, PNG, WEBP image are allowed", 400));
//     }
//     cb(null, true);
// }

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [
            {width: 300, height: 300, crop: "fill", gravity: "face"},
        ],
    },
});

export const upload = multer({storage, limits});