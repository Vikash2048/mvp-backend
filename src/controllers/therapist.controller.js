import Therapist from "../models/therapist.model.js";
import Booking from "../models/therapySessionBooking.model.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger({ module: "therapist-controller" });

// MAPPING: Full Profile View
const mapFullProfile = (data) => ({
  id: data._id,
  name: data.name,
  isAvailable: data.available_today,
  rating: data.rating,
  specialties: data.speciality,
  background: data.education_and_experience,
  slots: data.available_slots,
  languages: data.language,
  price: data.price_per_session,
  image: data.image,
  description: data.description,
  experience: getTotalExperience(data.education_and_experience),
  qualifications: getEducationTitles(data.education_and_experience),
  schedule: data.schedule,
});

// MAPPING: Directory List View (Lighter data)
const mapSummary = (data) => ({
  id: data._id,
  name: data.name,
  rating: data.rating,
  specialities: data.speciality,
  languages: data.language,
  experience: getTotalExperience(data.education_and_experience),
  price: data.price_per_session,
  isAvailable: data.available_today,
  image: data.image,
 
});

// Specific Mapping (DTO)
const mapResponse = (doc) => ({
  id: doc._id,
  name: doc.name,
  price: doc.price_per_session,
  description: doc.description,
  isAvailable: doc.available_today,
  rating: doc.rating,
  languages: doc.language,
  specialities: doc.speciality,
  background: doc.education_and_experience,
  slots: doc.available_slots,
  image: doc.image,
  status: doc.status,
});

function getTotalExperience(background = []) {
  return background
    .filter((item) => item.category === "Experience")
    .reduce((total, item) => {
      const years = parseInt(item.year_or_duration, 10);
      return total + (isNaN(years) ? 0 : years);
    }, 0);
}
function getEducationTitles(background = []) {
  return background
    .map((item) => item.title);
}

export const getTherapists = async (req, res) => {
  try {
    logger.info({
      functionName: "getTherapists",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get therapists handler hit");
    const list = await Therapist.find({ status: "active" });
    res.status(200).json({
      data: list.map((item) => mapSummary(item)),
      message: "Therapist List fetched successfully",
    });
  } catch (err) {
    logger.failure("Fetching therapists failed", err, {
      functionName: "getTherapists",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({ error: err.message });
  }
};

export const getTherapistById = async (req, res) => {
  try {
    logger.info({
      functionName: "getTherapistById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get therapist by id handler hit");
    const therapist = await Therapist.findById(req.params.id);
    therapist.schedule = await getTherapistSchedule(therapist._id, 7);
    if (!therapist) return res.status(404).json({ message: "Not found" });
    res.status(200).json({
      data: mapFullProfile(therapist),
      message: "Therapist fetched successfully",
    });
  } catch (err) {
    logger.failure("Fetching therapist by id failed", err, {
      functionName: "getTherapistById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({ error: "Invalid ID" });
  }
};

export const createTherapist = async (req, res) => {
  try {
    logger.info({
      functionName: "createTherapist",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Create therapist handler hit");
    const newEntry = await Therapist.create(req.body);
    res.status(201).json({
      data: mapFullProfile(newEntry),
      message: "Therapist created successfully",
    });
  } catch (err) {
    logger.failure("Creating therapist failed", err, {
      functionName: "createTherapist",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({ error: err.message });
  }
};

export const updateTherapist = async (req, res) => {
  try {
    logger.info({
      functionName: "updateTherapist",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Update therapist handler hit");
    const updatedTherapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only update fields sent in the request
      { new: true, runValidators: true }, // Return updated doc & check enums
    );

    if (!updatedTherapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    res.status(200).json({
      data: mapResponse(updatedTherapist),
      message: "Therapist updated successfully",
    });
  } catch (error) {
    logger.failure("Updating therapist failed", error, {
      functionName: "updateTherapist",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

export const getTherapistAvailability = async (req, res) => {
  try {
    logger.info({
      functionName: "getTherapistAvailability",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get therapist availability handler hit");
    const { therapistId } = req.params;
    const { daysCount = 7 } = req.query;

    const therapist = await Therapist.findById(therapistId);
    if (!therapist)
      return res.status(404).json({ message: "Therapist not found" });

    const masterSlots = therapist.available_slots;

    // FIX 1: Get today's date at 00:00:00 to include today's existing bookings
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const activeBookings = await Booking.find({
      therapistId,
      booking_status: { $in: ["pending", "confirmed"] },
      slot_date: { $gte: startOfToday }, // Now captures bookings from the start of today
    }).select("slot_date slot_time");

    let availabilitySchedule = [];

    for (let i = 0; i < daysCount; i++) {
      let date = new Date(startOfToday); // Use startOfToday as base
      date.setUTCDate(date.getUTCDate() + i);

      // FIX 2: Standardize date string using UTC methods to match DB storage
      const dateString =
        date.getUTCFullYear() +
        "-" +
        String(date.getUTCMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getUTCDate()).padStart(2, "0");

      const dailySlots = masterSlots.map((slotTime) => {
        const isTaken = activeBookings.some((b) => {
          // FIX 3: Convert stored DB date to YYYY-MM-DD using UTC to avoid timezone shifts
          const bDate = new Date(b.slot_date);
          const bDateString =
            bDate.getUTCFullYear() +
            "-" +
            String(bDate.getUTCMonth() + 1).padStart(2, "0") +
            "-" +
            String(bDate.getUTCDate()).padStart(2, "0");

          return bDateString === dateString && b.slot_time === slotTime;
        });

        return {
          time: slotTime,
          available: !isTaken,
        };
      });

      availabilitySchedule.push({
        date: dateString,
        slots: dailySlots,
      });
    }

    res.status(200).json({
      therapistName: therapist.name,
      schedule: availabilitySchedule,
    });
  } catch (error) {
    logger.failure("Fetching therapist availability failed", error, {
      functionName: "getTherapistAvailability",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({ error: error.message });
  }
};


export const getTherapistSchedule = async (therapistId, daysCount = 7) => {
  logger.info({
    functionName: "getTherapistSchedule",
    therapistId,
    daysCount,
  }, "Therapist schedule helper hit");
  const therapist = await Therapist.findById(therapistId);
  if (!therapist) {
    throw new Error("Therapist not found");
  }

  const masterSlots = therapist.available_slots;

  // Start of today (UTC)
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const activeBookings = await Booking.find({
    therapistId,
    booking_status: { $in: ["pending", "confirmed"] },
    slot_date: { $gte: startOfToday },
  }).select("slot_date slot_time");

  let availabilitySchedule = [];

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startOfToday);
    date.setUTCDate(date.getUTCDate() + i);

    const dateString =
      date.getUTCFullYear() +
      "-" +
      String(date.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getUTCDate()).padStart(2, "0");

    const dailySlots = masterSlots.map((slotTime) => {
      const isTaken = activeBookings.some((b) => {
        const bDate = new Date(b.slot_date);
        const bDateString =
          bDate.getUTCFullYear() +
          "-" +
          String(bDate.getUTCMonth() + 1).padStart(2, "0") +
          "-" +
          String(bDate.getUTCDate()).padStart(2, "0");

        return bDateString === dateString && b.slot_time === slotTime;
      });

      return {
        time: slotTime,
        available: !isTaken,
      };
    });

    availabilitySchedule.push({
      date: dateString,
      slots: dailySlots,
    });
  }
  return availabilitySchedule
};
