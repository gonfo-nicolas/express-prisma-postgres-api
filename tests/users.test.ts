import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { resetDatabase } from "./helpers/reset-db.js";
import { loginResponseSchema, userPayloadSchema, usersPayloadSchema } from "./helpers/schemas.js";

const app = createApp();

const getAdminToken = async (): Promise<string> => {
  const response = await request(app).post("/api/v1/auth/login").send({
    email: "admin@example.com",
    password: "password123",
  });

  return loginResponseSchema.parse(response.body).data.accessToken;
};

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("users", () => {
  it("registers a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      email: "new-user@example.com",
      name: "New User",
      password: "password123",
    });

    expect(response.status).toBe(201);
    const body = userPayloadSchema.parse(response.body);
    expect(body.data.email).toBe("new-user@example.com");
    expect(body.data.role).toBe("USER");
  });

  it("lists users for admins", async () => {
    const token = await getAdminToken();
    const response = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const body = usersPayloadSchema.parse(response.body);
    expect(body.meta.total).toBe(2);
  });
});
