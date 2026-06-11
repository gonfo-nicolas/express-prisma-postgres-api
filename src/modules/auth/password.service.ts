import { compare, hash } from "bcryptjs";

const PASSWORD_HASH_ROUNDS = 12;

export const hashPassword = (password: string): Promise<string> => hash(password, PASSWORD_HASH_ROUNDS);

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> =>
  compare(password, passwordHash);
