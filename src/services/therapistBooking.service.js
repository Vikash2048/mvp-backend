import mongoose from "mongoose";

import AppError from "../utils/AppError.js";

import * as therapistRepository
from "../repositories/therapist.repository.js";

import * as therapistBookingRepository
from "../repositories/therapistBooking.repository.js";

import {
    sendTherapyRequestMail,
} from "../utils/mailService.js";

import dayjs from "dayjs";


/* ------------------------------------------------ */
/* CREATE BOOKING */
/* ------------------------------------------------ */

export const createBooking =
  async (userId, bookingData) => {
    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {
      const {
        therapistId,
        slotDate,
        slotTime,
      } = bookingData;



      /*
       * VALIDATE THERAPIST
       */
      const therapist =
        await therapistRepository.findById(
          therapistId
        );

      if (!therapist) {
        throw new AppError(
          "Therapist not found",
          404
        );
      }



      /*
       * SLOT CONFLICT CHECK
       */
      const existingBooking =
        await therapistBookingRepository.findActiveSlotBooking(
          {
            therapistId,
            slotDate,
            slotTime,
          }
        );

      if (existingBooking) {
        throw new AppError(
          "Slot already booked",
          400
        );
      }



      /*
       * CREATE PENDING BOOKING
       */
      const booking =
        await therapistBookingRepository.create(
          {
            ...bookingData,

            userId,

            bookingStatus:
              "PENDING",

            paymentStatus:
              "PENDING",

            paymentAmount:
              therapist.price_per_session,
          },
          session
        );



      /*
       * FUTURE:
       * CREATE PAYMENT ORDER
       *
       * razorpay order
       * stripe payment intent
       */



      await session.commitTransaction();



      /*
       * SEND MAIL
       */
      await sendTherapyRequestMail(
        booking.email,
        booking.name,
        therapist.name,
        booking.slotTime,
        new Date(
          booking.slotDate
        ).toDateString(),
        booking.age,
        booking.gender,
        booking.phone,
        booking.concern,
        booking.languagePreference
      );



      return booking;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  };



/* ------------------------------------------------ */
/* GET MY BOOKINGS */
/* ------------------------------------------------ */

export const getMyBookings =
  async (userId, query) => {
    const {
      page = 1,
      limit = 10,
      status,
    } = query;

    const filters = {
      userId,
    };



    if (status) {
      filters.bookingStatus =
        status;
    }



    const skip =
      (page - 1) * limit;

    const result =
      await therapistBookingRepository.findAll(
        {
          filters,

          skip,

          limit:
            Number(limit),
        }
      );



    return {
      total: result.total,

      currentPage:
        Number(page),

      totalPages:
        Math.ceil(
          result.total / limit
        ),

      bookings:
        result.data,
    };
  };



/* ------------------------------------------------ */
/* GET BOOKING BY ID */
/* ------------------------------------------------ */

export const getBookingById =
  async (userId, bookingId) => {
    const booking =
      await therapistBookingRepository.findById(
        bookingId
      );

    if (!booking) {
      throw new AppError(
        "Booking not found",
        404
      );
    }



    /*
     * OWNERSHIP CHECK
     */
    if (
      booking.userId._id.toString() !==
      userId
    ) {
      throw new AppError(
        "Unauthorized access",
        403
      );
    }



    return booking;
  };



/* ------------------------------------------------ */
/* CONFIRM BOOKING */
/* ------------------------------------------------ */

export const confirmBooking =
  async (
    bookingId,
    paymentData = {}
  ) => {
    const booking =
      await therapistBookingRepository.findById(
        bookingId
      );

    if (!booking) {
      throw new AppError(
        "Booking not found",
        404
      );
    }



    if (
      booking.bookingStatus ===
      "CONFIRMED"
    ) {
      throw new AppError(
        "Booking already confirmed",
        400
      );
    }



    if (
      booking.bookingStatus ===
      "CANCELLED"
    ) {
      throw new AppError(
        "Cancelled booking cannot be confirmed",
        400
      );
    }



    return await therapistBookingRepository.confirmBooking(
      bookingId,
      paymentData
    );
  };



/* ------------------------------------------------ */
/* CANCEL BOOKING */
/* ------------------------------------------------ */

export const cancelBooking =
  async (
    userId,
    bookingId,
    reason = null
  ) => {
    const booking =
      await therapistBookingRepository.findById(
        bookingId
      );

    if (!booking) {
      throw new AppError(
        "Booking not found",
        404
      );
    }



    /*
     * OWNERSHIP CHECK
     */
    if (
      booking.userId._id.toString() !==
      userId
    ) {
      throw new AppError(
        "Unauthorized access",
        403
      );
    }



    /*
     * ALREADY CANCELLED
     */
    if (
      booking.bookingStatus ===
      "CANCELLED"
    ) {
      throw new AppError(
        "Booking already cancelled",
        400
      );
    }



    /*
     * FUTURE:
     * refund logic
     */



    return await therapistBookingRepository.cancelBooking(
      bookingId,
      reason
    );
  };



/* ------------------------------------------------ */
/* EXPIRE BOOKINGS */
/* ------------------------------------------------ */

export const expirePendingBookings =
  async () => {
    return await therapistBookingRepository.expirePendingBookings();
  };





export const getTherapistAvailability =
  async (
    therapistId,
    daysCount = 7
  ) => {
    /*
     * VALIDATE THERAPIST
     */
    const therapist =
      await therapistRepository.findById(
        therapistId
      );

    if (!therapist) {
      throw new AppError(
        "Therapist not found",
        404
      );
    }



    /*
     * MASTER SLOTS
     */
    const masterSlots =
      therapist.available_slots || [];



    /*
     * START DATE
     */
    const today =
      dayjs()
        .startOf("day")
        .toDate();



    /*
     * FETCH ACTIVE BOOKINGS
     */
    const activeBookings =
      await therapistBookingRepository.findActiveBookingsForAvailability(
        therapistId,
        today
      );



    /*
     * BUILD SCHEDULE
     */
    const schedule = [];



    for (
      let i = 0;
      i < daysCount;
      i++
    ) {
      const currentDate =
        dayjs(today)
          .add(i, "day");



      const dateString =
        currentDate.format(
          "YYYY-MM-DD"
        );



      const slots =
        masterSlots.map(
          (slotTime) => {
            const isBooked =
              activeBookings.some(
                (booking) => {
                  const bookingDate =
                    dayjs(
                      booking.slotDate
                    ).format(
                      "YYYY-MM-DD"
                    );



                  return (
                    bookingDate ===
                      dateString &&
                    booking.slotTime ===
                      slotTime
                  );
                }
              );



            return {
              time: slotTime,

              available:
                !isBooked,
            };
          }
        );



      schedule.push({
        date: dateString,

        slots,
      });
    }



    return {
      therapistId:
        therapist._id,

      therapistName:
        therapist.name,

      timezone:
        "Asia/Kolkata",

      schedule,
    };
  };