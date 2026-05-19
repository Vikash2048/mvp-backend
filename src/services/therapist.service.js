import AppError from "../utils/AppError.js";
import * as therapistRepo from "../repository/therapist.repository.js";
import * as bookingRepo from "../repository/therapistBooking.respository.js";

// DTP MAPPER
const mapSummary = (data) => ({
    id: data._id,
    name: data.name,
    rating: data.rating,
    specialties: data.specialties,
    languages: data.languages,
    price: data.pricePerSession,
    image: data.image,
});

const mapFullProfile = (data) => ({
    id: data._id,
    name: data.name,
    rating: data.rating,
    specialties: data.specialties,
    languages: data.languages,
    price: data.pricePerSession,
    image: data.image,
    description: data.description,
    background: data.educationAndExperience,
    weeklyAvailability: data.weeklyAvailability,
});

export const getTherapists = async(query) => {
    const { page = 1, limit = 10, specialty, language, minRating, search } = query;
    const filter = { status: "ACTIVE"};
    // speciality filter
    if (specialty) {
        filters.specialties = specialty;
    }

    // language filter
    if (language) {
        filters.languages = language;
    }

    // rating filter
    if (minRating) {
        filters.rating = { $gte: Number(minRating)};
    }

    // Search
    if (search) {
        filters.$text = { $search: search};
    }

    const skip = (Number(page) -1) * Number(limit);

    const result = await therapistRepo.findAll({ filters, skip, limit: Number(limit)});

    return {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        therapists: result.data.map(mapSummary),
    };
};

// GET SINGLE THERAPIST
export const getTherapistById = async(therapistId) => {
    const therapist = await therapistRepo.findById(therapistId);

    if (!therapist) {
        throw new AppError("Therapist not found", 404);
    }

    return mapFullProfile(therapist);
};

// CREATE THERAPIST
export const createTherapist = async(data) => {
    const therapist = await therapistRepo.create(data);
    return mapFullProfile(therapist);
}

// UPDATE THERAPIST
export const updateTherapist = async(therapistId,updateData) => {
    const existingTherapist = await therapistRepo.findById(therapistId);

    if (!existingTherapist) { 
        throw new AppError("Therapist not found",404);
    }

    const updatedTherapist = await therapistRepo.updateById(therapistId,updateData);
    return mapFullProfile(updatedTherapist);
};

// GET THERAPIST AVAILABILITY
export const getTherapistAvailability = async(therapistId,query) => {
    const therapist =await therapistRepo.findById(therapistId);

    if (!therapist) {
      throw new AppError("Therapist not found",404);
    }

    const daysCount = Number(query.daysCount) || 7;

    const startOfToday = new Date();

    startOfToday.setUTCHours(0,0,0,0);

    // ✅ Fetch active bookings
    const activeBookings = await bookingRepo.findActiveBookings(therapistId,startOfToday);

    let availabilitySchedule = [];

    for (let i = 0; i < daysCount; i++ ) {
      const date = new Date(startOfToday);

      date.setUTCDate(date.getUTCDate() + i);

      const dateString = date.toISOString().split("T")[0];

      // ✅ Find weekly availability
      const dayOfWeek = date.getUTCDay();

      const dailyAvailability = therapist.weeklyAvailability.filter( (slot) => slot.dayOfWeek === dayOfWeek );

      const slots =
        dailyAvailability.map(
          (slot) => {
            const isBooked =
              activeBookings.some(
                (booking) => {
                  const bookingDate =
                    booking.slotDate
                      .toISOString()
                      .split(
                        "T"
                      )[0];

                  return (
                    bookingDate ===
                      dateString &&
                    booking.slotTime ===
                      slot.startTime
                  );
                }
              );

            return {
              startTime:
                slot.startTime,

              endTime:
                slot.endTime,

              available:
                !isBooked,
            };
          }
        );

      availabilitySchedule.push({
        date: dateString,

        slots,
      });
    }

    return {
      therapistId: therapist._id,
      therapistName: therapist.name,
      schedule: availabilitySchedule,
    };
  };