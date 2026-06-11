import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { env } from "../../config/env.js";
import type { AccessTokenResult, AuthenticatedUser } from "./auth.types.js";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const secret = new TextEncoder().encode(env.JWT_SECRET);

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
});

export const signAccessToken = async (user: AuthenticatedUser): Promise<AccessTokenResult> => {
  const accessToken = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secret);

  return {
    accessToken,
    tokenType: "Bearer",
    expiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
  };
};

export const verifyAccessToken = async (token: string): Promise<AuthenticatedUser> => {
  const { payload } = await jwtVerify(token, secret, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  const parsed = tokenPayloadSchema.parse({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  });

  return {
    id: parsed.sub,
    email: parsed.email,
    role: parsed.role,
  };
};
