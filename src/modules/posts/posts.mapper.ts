import type { PostRecord, PostResponse } from "./posts.types.js";

export const toPostResponse = (post: PostRecord): PostResponse => {
  const base = {
    id: post.id,
    title: post.title,
    content: post.content,
    published: post.published,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  if (post.author === undefined || post.author === null) {
    return base;
  }

  return {
    ...base,
    author: {
      id: post.author.id,
      email: post.author.email,
      name: post.author.name,
    },
  };
};
