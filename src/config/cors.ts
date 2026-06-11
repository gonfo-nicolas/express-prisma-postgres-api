import type { CorsOptions } from "cors";
import { env } from "./env.js";

const parseOrigins = (value: string): string[] =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

export const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGIN === "*" ? true : parseOrigins(env.CORS_ORIGIN),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
