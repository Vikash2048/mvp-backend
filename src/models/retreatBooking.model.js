import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tourPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tourPackage",
      required: true,
    },

    tourSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tourSlot",
      required: true,
    },

    seatsBooked: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);
const retreatBooking = mongoose.model("retreatBooking", bookingSchema);
export default retreatBooking
