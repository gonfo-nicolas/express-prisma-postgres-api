import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.string().min(1),
  SHADOW_DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1).default("express-prisma-postgres-api"),
  JWT_AUDIENCE: z.string().min(1).default("express-prisma-postgres-api-users"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
});

export const env = envSchema.parse(process.env);
export type AppEnv = typeof env;
