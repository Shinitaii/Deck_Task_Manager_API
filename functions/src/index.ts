/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import express from "express";
import cors, {CorsOptions} from "cors";
import authRoutes from "./routes/Routes";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void) => {
    console.log(`CORS Request from: ${origin}`);
    const allowedOrigins = ["https://frontend.com"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();

// Middleware
app.use(cors(corsOptions));
// TODO: Add rate limiter
app.use(express.json());
// app.use(errorHandler);
app.use("/v1/task", authRoutes);
app.get("/v1", (req, res) => {
  res.json({
    message: "Deck Task Manager API is running",
  });
});

// eslint-disable-next-line camelcase
export const deck_task_manager_api = functions.https.onRequest(app);
