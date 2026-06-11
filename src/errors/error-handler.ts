import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";
import type { ErrorResponse } from "./error-response.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

const toValidationDetails = (error: ZodError): unknown =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const buildErrorResponse = (code: string, message: string, details?: unknown): ErrorResponse => {
  if (details === undefined) {
    return { error: { code, message } };
  }

  return { error: { code, message, details } };
};

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response<ErrorResponse>,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    response.status(400).json(
      buildErrorResponse("VALIDATION_ERROR", "Request validation failed.", toValidationDetails(error))
    );
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json(buildErrorResponse(error.code, error.message, error.details));
    return;
  }

  logger.error({ error, path: request.path }, "Unhandled request error");

  const details = env.NODE_ENV === "production" ? undefined : String(error);
  response.status(500).json(buildErrorResponse("INTERNAL_SERVER_ERROR", "Unexpected server error.", details));
}
