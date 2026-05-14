// admin.service.ts

import { prisma } from "../../../lib/prisma";

export const getUsersService = async () => {
  const users = await prisma.user.findMany();

  return users;
};

export const updateUserStatusService = async (
  id: string,
  status: string
) => {
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return updatedUser;
};