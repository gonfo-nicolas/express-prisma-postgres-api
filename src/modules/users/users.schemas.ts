import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(128),
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UsersQuery = z.infer<typeof usersQuerySchema>;
