import express from "express";
import tourSlotRouter from "./routes/retreateSlot.routes.js";
import tourPackageRoutes from "./routes/retreatPackages.routes.js";
import tourBookingRouter from "./routes/retreatBooking.routes.js";
import journalRouter from "./routes/journal.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import therapistRouter from "./routes/therapists.routes.js";
import therapistBookingRouter from "./routes/therapistBooking.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { createLogger } from "./utils/logger.js";
import { attachLogger } from "./middlewares/logger.middleware.js";
import { requestContext } from "./middlewares/requestContext.js";
import cookieParser from "cookie-parser";
import { handleMulterError } from "./middlewares/multer.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestContext);
app.use(attachLogger);
app.use((req, res, next) => {
    const startTime = Date.now();

    // request start log
    req.log.info(
        {query: req.query,},
        "Incoming request"
    );

    res.on("finish", () => {
        req.log.info(
            {
                statusCode: res.statusCode,
                durationMs: Date.now() - startTime,
            },
            "Request completed"
        );
    });

    next();
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/tour-packages", tourPackageRoutes);
app.use("/api/v1/tour-slots", tourSlotRouter);
app.use("/api/v1/tour-bookings", tourBookingRouter);

app.use("/api/v1/journals", journalRouter);

app.use("/api/v1/therapists", therapistRouter);
app.use("/api/v1/therapist-booking", therapistBookingRouter);

app.use(handleMulterError);
app.use(globalErrorHandler);

export default app;
