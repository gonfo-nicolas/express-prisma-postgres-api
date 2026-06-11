import { AppError } from "../../errors/app-error.js";
import type { ApiListResponse } from "../../lib/api-response.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import type { CreatePostInput, PostsQuery, UpdatePostInput } from "./posts.schemas.js";
import { toPostResponse } from "./posts.mapper.js";
import type { PostResponse } from "./posts.types.js";
import { createPost, deletePost, findPostById, findPosts, updatePost } from "./posts.repository.js";

const ensureCanMutatePost = (postAuthorId: string, actor: AuthenticatedUser): void => {
  const isOwner = postAuthorId === actor.id;
  const isAdmin = actor.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError({
      code: "FORBIDDEN",
      message: "You cannot mutate this post.",
      statusCode: 403,
    });
  }
};

export const listPostsService = async (query: PostsQuery): Promise<ApiListResponse<PostResponse>> => {
  const { posts, total } = await findPosts({
    page: query.page,
    limit: query.limit,
    published: query.published,
  });

  return {
    data: posts.map(toPostResponse),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
    },
  };
};

export const getPostService = async (id: string): Promise<PostResponse> => {
  const post = await findPostById(id);

  if (post === null) {
    throw new AppError({
      code: "POST_NOT_FOUND",
      message: "Post was not found.",
      statusCode: 404,
    });
  }

  return toPostResponse(post);
};

export const createPostService = async (
  actor: AuthenticatedUser,
  input: CreatePostInput
): Promise<PostResponse> => {
  const post = await createPost(actor.id, input);
  return toPostResponse(post);
};

export const updatePostService = async (
  actor: AuthenticatedUser,
  id: string,
  input: UpdatePostInput
): Promise<PostResponse> => {
  const existingPost = await findPostById(id);

  if (existingPost === null) {
    throw new AppError({
      code: "POST_NOT_FOUND",
      message: "Post was not found.",
      statusCode: 404,
    });
  }

  ensureCanMutatePost(existingPost.authorId, actor);
  const post = await updatePost(id, input);
  return toPostResponse(post);
};

export const deletePostService = async (actor: AuthenticatedUser, id: string): Promise<PostResponse> => {
  const existingPost = await findPostById(id);

  if (existingPost === null) {
    throw new AppError({
      code: "POST_NOT_FOUND",
      message: "Post was not found.",
      statusCode: 404,
    });
  }

  ensureCanMutatePost(existingPost.authorId, actor);
  const post = await deletePost(id);
  return toPostResponse(post);
};
