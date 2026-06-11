import { prisma } from "../../lib/prisma.js";
import { getOffset, type PaginationInput } from "../../lib/pagination.js";
import type { CreatePostInput, UpdatePostInput } from "./posts.schemas.js";

export type PostFilters = PaginationInput & {
  published: boolean | undefined;
};

const authorSelect = {
  id: true,
  email: true,
  name: true,
};

const postInclude = {
  author: {
    select: authorSelect,
  },
};

const buildPublishedWhere = (published: boolean | undefined) => {
  if (published === undefined) {
    return {};
  }

  return { published };
};

export const findPosts = async ({ page, limit, published }: PostFilters) => {
  const where = buildPublishedWhere(published);

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip: getOffset({ page, limit }),
      take: limit,
      orderBy: { createdAt: "desc" },
      include: postInclude,
    }),
  ]);

  return { total, posts };
};

export const findPostById = (id: string) =>
  prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });

export const createPost = (authorId: string, input: CreatePostInput) =>
  prisma.post.create({
    data: {
      ...input,
      authorId,
    },
    include: postInclude,
  });

const buildPostUpdateData = (input: UpdatePostInput) => ({
  ...(input.title === undefined ? {} : { title: input.title }),
  ...(input.content === undefined ? {} : { content: input.content }),
  ...(input.published === undefined ? {} : { published: input.published }),
});

export const updatePost = (id: string, input: UpdatePostInput) =>
  prisma.post.update({
    where: { id },
    data: buildPostUpdateData(input),
    include: postInclude,
  });

export const deletePost = (id: string) =>
  prisma.post.delete({
    where: { id },
    include: postInclude,
  });
