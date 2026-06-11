import { Router } from "express";
import { requireAuth, requireRole } from "../auth/auth.middleware.js";
import { getUser, listUsers, me, registerUser } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.post("/", registerUser);
usersRouter.get("/me", requireAuth, me);
usersRouter.get("/", requireAuth, requireRole("ADMIN"), listUsers);
usersRouter.get("/:id", requireAuth, getUser);
