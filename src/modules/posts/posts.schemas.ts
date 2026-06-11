import { z } from "zod";

export const postIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const postsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  published: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      return value === "true";
    }),
});

const titleSchema = z.string().trim().min(3).max(160);
const contentSchema = z.string().trim().min(10).max(10_000);

export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  published: z.boolean().default(false),
});

export const updatePostSchema = z
  .object({
    title: titleSchema.optional(),
    content: contentSchema.optional(),
    published: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type PostIdParams = z.infer<typeof postIdParamsSchema>;
export type PostsQuery = z.infer<typeof postsQuerySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
