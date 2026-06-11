import { prisma } from "../../src/lib/prisma.js";
import { hashPassword } from "../../src/modules/auth/password.service.js";

export const resetDatabase = async (): Promise<void> => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await hashPassword("password123");
  const userPasswordHash = await hashPassword("password123");

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin Demo",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Demo",
      passwordHash: userPasswordHash,
      role: "USER",
    },
  });
};
