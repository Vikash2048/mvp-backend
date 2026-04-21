import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
import logger, { createLogger } from "./src/utils/logger.js";

const serverLogger = createLogger({ module: "server" });

dotenv.config({ path: ".env" });

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info({ port: process.env.PORT }, "Database connected successfully");

        app.listen(process.env.PORT, () => {
            logger.info({ port: process.env.PORT }, "Server is running");
        });
    })
    .catch((error) => {
        serverLogger.failure("Failed to connect to database", error);
        process.exit(1);
    });
