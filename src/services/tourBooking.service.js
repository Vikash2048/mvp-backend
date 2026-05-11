import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import * as bookingRepo from "../repository/tourBooking.repository.js";
import * as slotRepo from "../repository/tourSlot.repository.js";
import * as packageRepo from "../repository/tourPackage.repository.js";
import { sendRetreatRequestMail } from "../utils/mailService.js";


// CREATE BOOKING 
export const createBooking = async (userId, data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const { tourPackageId, tourSlotId, seatsBooked, totalAmount, email, name, phone } = data;
        const tourPackage = await packageRepo.findById(tourPackageId);
        if (!tourPackage) {
            throw new AppError("Tour package not found", 404);
        }

        const slot = await slotRepo.reserveSeats({ tourSlotId, tourPackageId, seatsBooked }, session);
        if (!slot) {
            throw new AppError("Not enough seats available",400);
        }

        // create booking
        const booking = await bookingRepo.create({ userId,tourPackageId,tourSlotId,seatsBooked,totalAmount }, session);

        await session.commitTransaction();

        await sendRetreatRequestMail(email, name, tourPackage.title, seatsBooked, totalAmount, slot.startDate, phone );
        return booking;
    } catch (err) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }
}

// GET ALL BOOKING 
export const getAllBookings = async (user, query) => {
  const filters = {};

  // Admin → all bookings
  // User → only own bookings
  if (user.role !== "admin") {
    filters.userId = user.id;
  }

  if (query.tourPackageId) {
    filters.tourPackageId = query.tourPackageId;
  }

  if (query.tourSlotId) {
    filters.tourSlotId = query.tourSlotId;
  }

  return await bookingRepo.findAll(filters);
};

// GET BOOKING BY ID
export const getBookingById = async (user, bookingId) => {
  const booking = await bookingRepo.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Ownership check
  if (
    user.role !== "admin" &&
    booking.userId.toString() !== user.id
  ) {
    throw new AppError("Access denied", 403);
  }

  return booking;
};

// CANCEL BOOKING 
export const cancelBooking = async (user, bookingId) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const booking = await bookingRepo.findByIdWithSession( bookingId, session );

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    // Ownership check
    if (
      user.role !== "admin" &&
      booking.userId.toString() !== user.id
    ) {
      throw new AppError("Access denied", 403);
    }

    if (booking.status === "CANCELLED") {
      throw new AppError("Booking already cancelled", 400);
    }

    // rollback seats
    await slotRepo.releaseSeats( booking.tourSlotId, booking.seatsBooked, session );

    // update booking status
    await bookingRepo.updateStatus( booking._id, "CANCELLED", session );

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;

  } finally {
    session.endSession();
  }
};

// CONFIRM BOOKING 
export const confirmBooking = async (bookingId) => {
  const booking = await bookingRepo.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status === "CONFIRMED") {
    throw new AppError("Booking already confirmed", 400);
  }

  return await bookingRepo.updateStatus(
    bookingId,
    "CONFIRMED"
  );
};
