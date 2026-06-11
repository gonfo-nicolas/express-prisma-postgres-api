import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import { createPost, deletePost, getPost, listPosts, updatePost } from "./posts.controller.js";

export const postsRouter = Router();

postsRouter.get("/", listPosts);
postsRouter.get("/:id", getPost);
postsRouter.post("/", requireAuth, createPost);
postsRouter.put("/:id", requireAuth, updatePost);
postsRouter.delete("/:id", requireAuth, deletePost);
