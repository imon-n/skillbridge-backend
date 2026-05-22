"use strict";
// admin.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatusService = exports.getUsersService = void 0;
const prisma_1 = require("../../../lib/prisma");
const getUsersService = async () => {
    const users = await prisma_1.prisma.user.findMany();
    return users;
};
exports.getUsersService = getUsersService;
const updateUserStatusService = async (id, status) => {
    const updatedUser = await prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return updatedUser;
};
exports.updateUserStatusService = updateUserStatusService;
