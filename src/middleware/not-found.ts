import type { RequestHandler } from "express";
import type { ErrorResponse } from "../errors/error-response.js";

export const notFoundHandler: RequestHandler<Record<string, string>, ErrorResponse> = (request, response) => {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${request.method} ${request.path} was not found.`,
    },
  });
};
