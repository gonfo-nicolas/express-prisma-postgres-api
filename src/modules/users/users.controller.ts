import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import type { ApiListResponse, ApiResponse } from "../../lib/api-response.js";
import type { UserResponse } from "./users.types.js";
import { registerUserSchema, userIdParamsSchema, usersQuerySchema } from "./users.schemas.js";
import { getUserService, listUsersService, registerUserService } from "./users.service.js";

type UserPayload = ApiResponse<UserResponse>;
type UsersPayload = ApiListResponse<UserResponse>;

export const registerUser: RequestHandler<Record<string, string>, UserPayload, unknown> = async (
  request,
  response
) => {
  const input = registerUserSchema.parse(request.body);
  const data = await registerUserService(input);
  response.status(201).json({ data });
};

export const listUsers: RequestHandler<Record<string, string>, UsersPayload, unknown> = async (
  request,
  response
) => {
  const query = usersQuerySchema.parse(request.query);
  const payload = await listUsersService(query);
  response.status(200).json(payload);
};

export const getUser: RequestHandler<{ id: string }, UserPayload, unknown> = async (request, response) => {
  const params = userIdParamsSchema.parse(request.params);
  const data = await getUserService(params.id);
  response.status(200).json({ data });
};

export const me: RequestHandler<Record<string, string>, UserPayload, unknown> = async (request, response) => {
  if (request.authUser === undefined) {
    throw new AppError({
      code: "AUTHENTICATION_REQUIRED",
      message: "You must be authenticated to access this resource.",
      statusCode: 401,
    });
  }

  const data = await getUserService(request.authUser.id);
  response.status(200).json({ data });
};
