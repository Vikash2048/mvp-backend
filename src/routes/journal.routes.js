import express from "express";

import {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournalById,
  deleteJournalById,
  getJournalTags,
} from "../controllers/journal.controller.js";

import {
  createJournalSchema,
  updateJournalSchema,
  validateBody,
} from "../middlewares/validation.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


// ALL JOURNAL ROUTES PROTECTED
router.use(authMiddleware);

// JOURNAL TAGS
router.get("/tags", getJournalTags);

// CREATE + GET ALL
router
  .route("/")
  .post(
    validateBody(createJournalSchema),
    createJournal
  )
  .get(getAllJournals);

// SINGLE JOURNAL
router
  .route("/:id")
  .get(getJournalById)
  .patch(
    validateBody(updateJournalSchema),
    updateJournalById
  )
  .delete(deleteJournalById);


export default router;

// import express from "express";
// import { createJournal, deleteJournalById, getAllJournals, getJournalById, getJournalTags, updateJournalById } from "../controllers/journal.controller.js";
// import { createJournalSchema, updateJournalSchema, validateBody } from "../middlewares/validation.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

// const journalRouter = express.Router();

// journalRouter.post("/create", authMiddleware, validateBody(createJournalSchema), createJournal);
// journalRouter.get("/", authMiddleware, getAllJournals);
// journalRouter.get("/tags", getJournalTags);
// journalRouter.get("/:id", authMiddleware,getJournalById);
// journalRouter.patch("/:id", authMiddleware, validateBody(updateJournalSchema), updateJournalById);
// journalRouter.delete("/:id", authMiddleware, deleteJournalById);
// export default journalRouter;