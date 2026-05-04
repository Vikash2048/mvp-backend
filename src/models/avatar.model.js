import mongoose from "mongoose";
const avatarSchema = new mongoose.Schema(
    {
        seed: { type: String, required: true }, // unique
        style: {type: String, required: true},
    }
)

const Avatar = mongoose.model("Avatar", avatarSchema);
 export default Avatar;