import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorHandler } from "./errors/error-handler.js";
import { openApiDocument } from "./docs/openapi.js";
import { health } from "./health/health.controller.js";
import { logger } from "./lib/logger.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { apiRouter } from "./routes/api.routes.js";

export const createApp = (): express.Express => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    })
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(pinoHttp({ logger }));
  app.use(express.static("public", { index: "index.html" }));

  app.get("/health", health);
  app.get("/openapi.json", (_request, response) => {
    response.status(200).json(openApiDocument);
  });
  app.use("/api/v1", apiRouter);
  app.all("/{*splat}", notFoundHandler);
  app.use(errorHandler);

  return app;
};
