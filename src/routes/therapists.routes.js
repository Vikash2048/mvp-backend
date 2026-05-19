import express from "express";
import {
  getTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  getTherapistAvailability,
} from "../controllers/therapist.controller.js";
import  {
  therapistUpdateSchema,
  therapistValidationSchema,
  validateBody,
} from "../middlewares/validation.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getTherapists);
router.get("/:id", getTherapistById);
router.get("/:id/availability", getTherapistAvailability);

// ADMIN ROUTES
router.post(
  "/",
  authMiddleware,
  isAdmin,
  validateBody(therapistValidationSchema),
  createTherapist
);

router.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  validateBody(therapistUpdateSchema),
  updateTherapist
);

export default router;

// const therapistRouter = express.Router();

// therapistRouter.get("/getall", getTherapists);
// therapistRouter.get("/:id", getTherapistById);
// therapistRouter.post(
//   "/create",
//   validateBody(therapistValidationSchema),
//   createTherapist,
// );
// therapistRouter.put("/update/:id", validateBody(therapistUpdateSchema), updateTherapist);
// therapistRouter.get("/availability/:therapistId", getTherapistAvailability)
// export default therapistRouter;
