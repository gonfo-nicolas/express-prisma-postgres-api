import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { resetDatabase } from "./helpers/reset-db.js";
import { loginResponseSchema, userPayloadSchema } from "./helpers/schemas.js";

const app = createApp();

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("auth", () => {
  it("logs in and returns a JWT", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    const body = loginResponseSchema.parse(response.body);
    expect(body.data.user.email).toBe("admin@example.com");
    expect(body.data.tokenType).toBe("Bearer");
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });

  it("returns the current authenticated user", async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    const loginBody = loginResponseSchema.parse(loginResponse.body);
    const response = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${loginBody.data.accessToken}`);

    expect(response.status).toBe(200);
    const body = userPayloadSchema.parse(response.body);
    expect(body.data.email).toBe("admin@example.com");
  });
});
