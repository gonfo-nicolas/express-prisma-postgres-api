import { AppError } from "../../errors/app-error.js";
import { findUserCredentialsByEmail } from "../users/users.repository.js";
import { toAuthenticatedUser, toUserResponse } from "../users/users.mapper.js";
import type { UserResponse } from "../users/users.types.js";
import type { AccessTokenResult } from "./auth.types.js";
import type { LoginInput } from "./auth.schemas.js";
import { signAccessToken } from "./token.service.js";
import { verifyPassword } from "./password.service.js";

export type LoginResult = AccessTokenResult & {
  user: UserResponse;
};

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  const user = await findUserCredentialsByEmail(input.email);

  if (user === null) {
    throw new AppError({
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
      statusCode: 401,
    });
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError({
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
      statusCode: 401,
    });
  }

  const token = await signAccessToken(toAuthenticatedUser(user));

  return {
    ...token,
    user: toUserResponse(user),
  };
};
