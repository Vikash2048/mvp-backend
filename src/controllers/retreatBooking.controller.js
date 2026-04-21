import mongoose from "mongoose";
import RetreatBooking from "../models/retreatBooking.model.js";
import TourSlot from "../models/tourSlot.model.js";
import { sendRetreatRequestMail } from "../utils/mailService.js";
import tourPackage from "../models/tourPackage.model.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger({ module: "retreat-booking-controller" });

/**
 * CREATE booking (ATOMIC)
 */
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    logger.info({
      functionName: "createBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Retreat booking create handler hit");
    const {  tourPackageId, tourSlotId, seatsBooked, totalAmount,email,name,phone } =
      req.body;
const userId = req?.user?.id ;
    // Atomic seat check + update
    const slot = await TourSlot.findOneAndUpdate(
      {
        _id: tourSlotId,
        tourPackageId,
        isActive: true,
        bookedSeats: { $lte: 6 - seatsBooked },
      },
      {
        $inc: { bookedSeats: seatsBooked },
      },
      { new: true, session },
    );

    if (!slot) {
      throw new Error("Not enough seats available");
    }

    const booking = await RetreatBooking.create(
      [
        {
          userId,
          tourPackageId,
          tourSlotId,
          seatsBooked,
          totalAmount,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    const packageInfo = await tourPackage.findById(tourPackageId);
    await sendRetreatRequestMail(email, name, packageInfo.title, seatsBooked, totalAmount, slot.startDate,phone);

   res.status(201).json({
     success: true,
     message: "Booking Request Raised Successfully",
     data: booking[0],
   });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.failure("Retreat booking creation failed", error, {
      functionName: "createBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET all bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    logger.info({
      functionName: "getAllBookings",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Retreat booking list handler hit");
    const filter = {};
    const userId = req.user.id;
    // Optional filter by user
    if (req.query.userId) {
      filter.userId = userId
    }
    if (req.query.tourPackageId) {
      filter.tourPackageId = req.query.tourPackageId;
    }
    if (req.query.tourSlotId) {
      filter.tourSlotId = req.query.tourSlotId;
    }
    const bookings = await RetreatBooking.find(filter)
      .populate("tourPackageId", "title location images")
      .populate("tourSlotId", "startDate endDate")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    logger.failure("Fetching retreat bookings failed", error, {
      functionName: "getAllBookings",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    logger.info({
      functionName: "getBookingById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Retreat booking detail handler hit");
    const booking = await RetreatBooking.findById(req.params.id)
      .populate("tourPackageId")
      .populate("tourSlotId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.failure("Fetching retreat booking by id failed", error, {
      functionName: "getBookingById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }
};

/**
 * CANCEL booking
 */
export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    logger.info({
      functionName: "cancelBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Retreat booking cancel handler hit");
    const booking = await RetreatBooking.findById(req.params.id).session(
      session,
    );

    if (!booking || booking.status === "CANCELLED") {
      throw new Error("Invalid booking");
    }

    // Rollback seats
    await TourSlot.updateOne(
      { _id: booking.tourSlotId },
      { $inc: { bookedSeats: -booking.seatsBooked } },
      { session },
    );

    booking.status = "CANCELLED";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.failure("Cancelling retreat booking failed", error, {
      functionName: "cancelBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const confirmedBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    logger.info({
      functionName: "confirmedBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Retreat booking confirm handler hit");
    const booking = await RetreatBooking.findById(req.params.id).session(
      session,
    );

    if (!booking || booking.status === "CONFIRMED") {
      throw new Error("Invalid booking");
    }


    booking.status = "CONFIRMED";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Booking Confirmed",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.failure("Confirming retreat booking failed", error, {
      functionName: "confirmedBooking",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
