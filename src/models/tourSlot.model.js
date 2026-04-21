import mongoose from "mongoose";

const tourSlotSchema = new mongoose.Schema(
  {
    tourPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tourPackage",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    maxCapacity: {
      type: Number,
      default: 6,
    },

    bookedSeats: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);



const tourSlot = mongoose.model("tourSlot", tourSlotSchema);

export default tourSlot;