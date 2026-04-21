import express from "express";

import  {
  therapistUpdateSchema,therapistValidationSchema,
  validateBody,
} from "../middlewares/validation.js";
import { createBooking, getBookingById,getAllBookings, confirmedBooking, cancelBooking } from "../controllers/therapistBooking.controller.js";
import { authMiddleware } from "../utils/jwt.util.js";

const therapistBookingRouter = express.Router();

therapistBookingRouter.get("/my-sessions",authMiddleware ,getAllBookings);
therapistBookingRouter.get("/my-sessions/:id", authMiddleware, getBookingById);
therapistBookingRouter.post(
  "/create",
  authMiddleware,
  createBooking,
);
therapistBookingRouter.put("/confirm/:id",confirmedBooking);
therapistBookingRouter.put("/cancel/:id",cancelBooking);
export default therapistBookingRouter;