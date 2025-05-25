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
import cors from "cors";
import {corsOptions} from "../src/config/corsOption";
import authRoutes from "./routes/Routes";
import {AuthenticationService} from "./services/AuthenticationService";
import {logRequest} from "./middleware/loggerMiddleware";
import {errorHandler} from "./middleware/errorHandler";

const app = express();
const authService = new AuthenticationService();

// Middleware
app.use(cors(corsOptions));
// TODO: Add rate limiter
app.use(express.json());
// Middleware to verify Firebase token
app.use(authService.verifyFirebaseToken.bind(authService));
app.use(logRequest);
// app.use(errorHandler);
app.use("/v1/task", authRoutes);
app.get("/v1", (req, res) => {
  res.json({
    message: "Deck Task Manager API is running",
  });
});
app.use(errorHandler);

// eslint-disable-next-line camelcase
export const deck_task_manager_api = functions.https.onRequest(app);
