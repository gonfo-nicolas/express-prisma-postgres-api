export type UserRole = "USER" | "ADMIN";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type AccessTokenResult = {
  accessToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
};
