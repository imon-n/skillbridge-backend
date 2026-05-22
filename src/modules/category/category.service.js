"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createCategory = void 0;
const prisma_1 = require("../../../lib/prisma");
const createCategory = async (data) => {
    if (!data.name) {
        throw new Error("Category name is required");
    }
    const exists = await prisma_1.prisma.category.findUnique({
        where: { name: data.name },
    });
    if (exists) {
        throw new Error("Category already exists");
    }
    return prisma_1.prisma.category.create({
        data: {
            name: data.name,
        },
    });
};
exports.createCategory = createCategory;
const getCategories = async () => {
    return prisma_1.prisma.category.findMany();
};
exports.getCategories = getCategories;
