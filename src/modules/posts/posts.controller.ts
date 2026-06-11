import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import type { ApiListResponse, ApiResponse } from "../../lib/api-response.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import type { PostResponse } from "./posts.types.js";
import {
  createPostSchema,
  postIdParamsSchema,
  postsQuerySchema,
  updatePostSchema,
} from "./posts.schemas.js";
import {
  createPostService,
  deletePostService,
  getPostService,
  listPostsService,
  updatePostService,
} from "./posts.service.js";

type PostPayload = ApiResponse<PostResponse>;
type PostsPayload = ApiListResponse<PostResponse>;

const getActor = (request: { authUser?: AuthenticatedUser }): AuthenticatedUser => {
  if (request.authUser === undefined) {
    throw new AppError({
      code: "AUTHENTICATION_REQUIRED",
      message: "You must be authenticated to access this resource.",
      statusCode: 401,
    });
  }

  return request.authUser;
};

export const listPosts: RequestHandler<Record<string, string>, PostsPayload, unknown> = async (
  request,
  response
) => {
  const query = postsQuerySchema.parse(request.query);
  const payload = await listPostsService(query);
  response.status(200).json(payload);
};

export const getPost: RequestHandler<{ id: string }, PostPayload, unknown> = async (request, response) => {
  const params = postIdParamsSchema.parse(request.params);
  const data = await getPostService(params.id);
  response.status(200).json({ data });
};

export const createPost: RequestHandler<Record<string, string>, PostPayload, unknown> = async (
  request,
  response
) => {
  const actor = getActor(request);
  const input = createPostSchema.parse(request.body);
  const data = await createPostService(actor, input);
  response.status(201).json({ data });
};

export const updatePost: RequestHandler<{ id: string }, PostPayload, unknown> = async (request, response) => {
  const actor = getActor(request);
  const params = postIdParamsSchema.parse(request.params);
  const input = updatePostSchema.parse(request.body);
  const data = await updatePostService(actor, params.id, input);
  response.status(200).json({ data });
};

export const deletePost: RequestHandler<{ id: string }, PostPayload, unknown> = async (request, response) => {
  const actor = getActor(request);
  const params = postIdParamsSchema.parse(request.params);
  const data = await deletePostService(actor, params.id);
  response.status(200).json({ data });
};
