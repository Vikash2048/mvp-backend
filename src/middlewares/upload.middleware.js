import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [
            {width: 300, height: 300, crop: "fill", gravity: "face"},
        ],
    },
});

export const upload = multer({storage});