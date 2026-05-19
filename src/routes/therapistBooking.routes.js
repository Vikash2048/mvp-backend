import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  getTherapistAvailability
} from "../controllers/therapistBooking.controller.js";

import {validateBody,createTherapyBookingSchema} from "../middlewares/validation.js";

const router = express.Router();

router.post( "/", authMiddleware, validateBody(createTherapyBookingSchema), createBooking );
router.get( "/my-sessions",  authMiddleware, getMyBookings );
router.get( "/:id", authMiddleware, getBookingById );
router.patch( "/:id/confirm", confirmBooking );
router.patch( "/:id/cancel", authMiddleware, cancelBooking );
router.get( "/availability/:therapistId", getTherapistAvailability );

export default router;





// import express from "express";

// import  {
//   therapistUpdateSchema,therapistValidationSchema,
//   validateBody,
// } from "../middlewares/validation.js";
// import { createBooking, getBookingById,getAllBookings, confirmedBooking, cancelBooking } from "../controllers/therapistBooking.controller.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

// const therapistBookingRouter = express.Router();

// therapistBookingRouter.get("/my-sessions",authMiddleware ,getAllBookings);
// therapistBookingRouter.get("/my-sessions/:id", authMiddleware, getBookingById);
// therapistBookingRouter.post(
//   "/create",
//   authMiddleware,
//   createBooking,
// );
// therapistBookingRouter.put("/confirm/:id",confirmedBooking);
// therapistBookingRouter.put("/cancel/:id",cancelBooking);
// export default therapistBookingRouter;