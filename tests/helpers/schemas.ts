import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const postResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  authorId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z
    .object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string(),
    })
    .optional(),
});

export const loginResponseSchema = z.object({
  data: z.object({
    accessToken: z.string().min(1),
    tokenType: z.literal("Bearer"),
    expiresInSeconds: z.number().int().positive(),
    user: userResponseSchema,
  }),
});

export const userPayloadSchema = z.object({ data: userResponseSchema });
export const usersPayloadSchema = z.object({
  data: z.array(userResponseSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
});
export const postPayloadSchema = z.object({ data: postResponseSchema });
export const postsPayloadSchema = z.object({
  data: z.array(postResponseSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
});
