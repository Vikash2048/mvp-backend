import express from "express";
import {
  getTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  getTherapistAvailability,
} from "../controllers/therapist.controller.js";
import  {
  therapistUpdateSchema,therapistValidationSchema,
  validateBody,
} from "../middlewares/validation.js";

const therapistRouter = express.Router();

therapistRouter.get("/getall", getTherapists);
therapistRouter.get("/:id", getTherapistById);
therapistRouter.post(
  "/create",
  validateBody(therapistValidationSchema),
  createTherapist,
);
therapistRouter.put("/update/:id", validateBody(therapistUpdateSchema), updateTherapist);
therapistRouter.get("/availability/:therapistId", getTherapistAvailability)
export default therapistRouter;
