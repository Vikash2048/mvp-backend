import express from "express";
import {
  createTourPackage,
  getAllTourPackages,
  getTourPackageById,
  updateTourPackage,
  deleteTourPackage,
} from "../controllers/retreats.controller.js";
import { createTourPackageSchema, validateBody, updateTourPackageSchema } from "../middlewares/validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllTourPackages) // public
  .post(
    authMiddleware,
    isAdmin,
    validateBody(createTourPackageSchema),
    createTourPackage
  )

router
  .route("/:id")
  .get(getTourPackageById) // ✅ public
  .patch(
    authMiddleware,
    isAdmin,
    validateBody(updateTourPackageSchema),
    updateTourPackage
  )
  .delete(authMiddleware, isAdmin, deleteTourPackage);

  /* 
  
  router.post("/",validateBody(createTourPackageSchema), createTourPackage);
  
  // READ
  router.get("/", getAllTourPackages);
  router.get("/:id", getTourPackageById);
  
  // UPDATE
  router.put("/:id", updateTourPackage);
  
  // DELETE
  router.delete("/:id", deleteTourPackage);
  
  */
export default router;
