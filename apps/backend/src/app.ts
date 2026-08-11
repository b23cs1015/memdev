import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origin === env.FRONTEND_URL) {
        callback(null, true);
        return;
      }

      if (
        origin.startsWith(
          "chrome-extension://",
        )
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error("Origin not allowed by CORS"),
      );
    },
  }),
);

app.use(express.json());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;