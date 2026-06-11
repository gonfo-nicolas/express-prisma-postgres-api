import type { UserRole } from "../auth/auth.types.js";

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCredentialsRecord = UserRecord & {
  passwordHash: string;
};
