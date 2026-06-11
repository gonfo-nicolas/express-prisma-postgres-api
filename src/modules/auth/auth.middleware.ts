import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import { verifyAccessToken } from "./token.service.js";
import type { UserRole } from "./auth.types.js";

const extractBearerToken = (authorizationHeader: string | undefined): string => {
  if (authorizationHeader === undefined) {
    throw new AppError({
      code: "AUTHENTICATION_REQUIRED",
      message: "Missing Authorization header.",
      statusCode: 401,
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || token === undefined || token.length === 0) {
    throw new AppError({
      code: "INVALID_AUTHORIZATION_HEADER",
      message: "Authorization header must use the Bearer scheme.",
      statusCode: 401,
    });
  }

  return token;
};

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const token = extractBearerToken(request.header("authorization"));
    request.authUser = await verifyAccessToken(token);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const requireRole = (role: UserRole): RequestHandler => (request, _response, next) => {
  if (request.authUser === undefined) {
    next(
      new AppError({
        code: "AUTHENTICATION_REQUIRED",
        message: "You must be authenticated to access this resource.",
        statusCode: 401,
      })
    );
    return;
  }

  if (request.authUser.role !== role) {
    next(
      new AppError({
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource.",
        statusCode: 403,
      })
    );
    return;
  }

  next();
};
