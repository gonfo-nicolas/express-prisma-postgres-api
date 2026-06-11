import type { RequestHandler } from "express";
import type { ApiResponse } from "../../lib/api-response.js";
import { loginSchema } from "./auth.schemas.js";
import type { LoginResult } from "./auth.service.js";
import { loginUser } from "./auth.service.js";

type LoginResponse = ApiResponse<LoginResult>;

export const login: RequestHandler<Record<string, string>, LoginResponse, unknown> = async (
  request,
  response
) => {
  const input = loginSchema.parse(request.body);
  const data = await loginUser(input);
  response.status(200).json({ data });
};
