import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  confirmedBooking,
  confirmBooking,
} from "../controllers/tourBooking.controller.js";
import { createBookingSchema, validateBody } from "../middlewares/validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    validateBody(createBookingSchema),
    createBooking
  )
  .get(authMiddleware, getAllBookings); // filtered inside service

router
  .route("/:id")
  .get(authMiddleware, getBookingById);

// Actions
router.patch("/:id/cancel", authMiddleware, cancelBooking);

router.patch(
  "/:id/confirm",
  authMiddleware,
  isAdmin,
  confirmBooking
);

/*

retreatBookingRouter.post("/", authMiddleware, validateBody(createBookingSchema), createBooking);
retreatBookingRouter.get("/", authMiddleware, getAllBookings);
retreatBookingRouter.get("/:id", authMiddleware, getBookingById);
retreatBookingRouter.patch("/:id/cancel", cancelBooking);
retreatBookingRouter.patch("/:id/confirm", confirmedBooking);
*/

export default retreatBookingRouter;