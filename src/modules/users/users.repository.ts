import { prisma } from "../../lib/prisma.js";
import { getOffset, type PaginationInput } from "../../lib/pagination.js";

export type CreateUserData = {
  email: string;
  name: string;
  passwordHash: string;
};

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const findUsers = async ({ page, limit }: PaginationInput) => {
  const [total, users] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      skip: getOffset({ page, limit }),
      take: limit,
      orderBy: { createdAt: "desc" },
      select: publicUserSelect,
    }),
  ]);

  return { total, users };
};

export const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: publicUserSelect,
  });

export const findUserCredentialsByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const createUser = (data: CreateUserData) =>
  prisma.user.create({
    data,
    select: publicUserSelect,
  });
