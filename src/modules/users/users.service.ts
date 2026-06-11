import { AppError } from "../../errors/app-error.js";
import type { ApiListResponse } from "../../lib/api-response.js";
import type { PaginationInput } from "../../lib/pagination.js";
import { hashPassword } from "../auth/password.service.js";
import type { RegisterUserInput } from "./users.schemas.js";
import { toUserResponse } from "./users.mapper.js";
import type { UserResponse } from "./users.types.js";
import { createUser, findUserByEmail, findUserById, findUsers } from "./users.repository.js";

export const listUsersService = async (pagination: PaginationInput): Promise<ApiListResponse<UserResponse>> => {
  const { users, total } = await findUsers(pagination);

  return {
    data: users.map(toUserResponse),
    meta: {
      ...pagination,
      total,
    },
  };
};

export const getUserService = async (id: string): Promise<UserResponse> => {
  const user = await findUserById(id);

  if (user === null) {
    throw new AppError({
      code: "USER_NOT_FOUND",
      message: "User was not found.",
      statusCode: 404,
    });
  }

  return toUserResponse(user);
};

export const registerUserService = async (input: RegisterUserInput): Promise<UserResponse> => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser !== null) {
    throw new AppError({
      code: "EMAIL_ALREADY_USED",
      message: "A user already exists with this email.",
      statusCode: 409,
    });
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email: input.email,
    name: input.name,
    passwordHash,
  });

  return toUserResponse(user);
};
