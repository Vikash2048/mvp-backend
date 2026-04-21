import mongoose from "mongoose";

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    images:[String],
    location: String,

    durationDays: Number,

    pricePerSeat: {
      type: Number,
      required: true,
    },

    maxCapacity: {
      type: Number,
      default: 6, // per slot
    },
  },
  { timestamps: true },
);
const tourPackage = mongoose.model("tourPackage", tourPackageSchema);
export default tourPackage;