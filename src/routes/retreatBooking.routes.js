import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  confirmedBooking,
} from "../controllers/retreatBooking.controller.js";
import { createBookingSchema, validateBody } from "../middlewares/validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const retreatBookingRouter = express.Router();

retreatBookingRouter.post("/", authMiddleware, validateBody(createBookingSchema), createBooking);
retreatBookingRouter.get("/", authMiddleware, getAllBookings);
retreatBookingRouter.get("/:id", authMiddleware, getBookingById);
retreatBookingRouter.patch("/:id/cancel", cancelBooking);
retreatBookingRouter.patch("/:id/confirm", confirmedBooking);

export default retreatBookingRouter;