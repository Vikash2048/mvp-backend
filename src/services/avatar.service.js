import * as userRepo from "../repository/user.respository.js";
import cloudinary from "../utils/cloudinary.js";

/* GENERATEING USER AVATAR USING DICE BEAR */
export const getAvatarOptions = async() => {
    const styles = ["lorelei", "avataaars", "bottts", "personas"];
    const seed = Math.random().toString(36).substring(7);

    return styles.map((style) => ({
        seed,
        style,
        url: `https://api.dicebear.com/7.x/${style}/png?seed=${seed}`,
    }));
}

/* USER SELECTS SYSTEM AVATAR */
export const selectAvatar = async (userId, seed, style) => {
    return await userRepo.updateAvatar(userId, {
        type: "system",
        seed,
        style,
        url: null,
    });
};

/* COSTUM AVATAR UPLOAD */
export const uploadAvatar = async (userId, file) => {
    // delete previous avatar before uploading new one 
    const user = await userRepo.findById(userId);

    if(user.avatar?.type === "custom" && user.avatar.publicId) {
        await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    // handle file from cloudinary
    const imageUrl = file.path;
    const publicId = file.filename;

    await userRepo.updateAvatar(userId, {
        type: "custom",
        url: imageUrl,
        publicId,
        seed: null,
        style: null,
    });

    return {
        avatarUrl : imageUrl,
    };
};