import type { AuthenticatedUser, UserRole } from "../auth/auth.types.js";
import type { UserCredentialsRecord, UserRecord, UserResponse } from "./users.types.js";

const toUserRole = (role: string): UserRole => {
  if (role === "ADMIN") {
    return "ADMIN";
  }

  return "USER";
};

export const toUserResponse = (user: UserRecord): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: toUserRole(user.role),
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const toAuthenticatedUser = (user: UserCredentialsRecord): AuthenticatedUser => ({
  id: user.id,
  email: user.email,
  role: toUserRole(user.role),
});
