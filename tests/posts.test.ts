import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { resetDatabase } from "./helpers/reset-db.js";
import { loginResponseSchema, postPayloadSchema, postsPayloadSchema } from "./helpers/schemas.js";

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

describe("posts", () => {
  it("creates and lists posts", async () => {
    const token = await getAdminToken();

    const createResponse = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Modern Express API",
        content: "This post is created from an integration test.",
        published: true,
      });

    expect(createResponse.status).toBe(201);
    const createdPost = postPayloadSchema.parse(createResponse.body).data;
    expect(createdPost.title).toBe("Modern Express API");

    const listResponse = await request(app).get("/api/v1/posts?published=true");
    expect(listResponse.status).toBe(200);
    const listBody = postsPayloadSchema.parse(listResponse.body);
    expect(listBody.meta.total).toBe(1);
  });

  it("updates owned posts", async () => {
    const token = await getAdminToken();

    const createResponse = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Draft Title",
        content: "This draft will be updated by its owner.",
      });

    const createdPost = postPayloadSchema.parse(createResponse.body).data;
    const updateResponse = await request(app)
      .put(`/api/v1/posts/${createdPost.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ published: true });

    expect(updateResponse.status).toBe(200);
    const updatedPost = postPayloadSchema.parse(updateResponse.body).data;
    expect(updatedPost.published).toBe(true);
  });
});
