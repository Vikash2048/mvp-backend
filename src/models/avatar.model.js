import mongoose from "mongoose";
const avatarSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        name: { type: String, required: true },

    }
)

const Avatar = mongoose.model("Avatar", avatarSchema);
 export default Avatar;