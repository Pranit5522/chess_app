import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";

export const createUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      username: data.username,
      password: hashedPassword,
    }
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const verifyPassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
