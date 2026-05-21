import { prisma } from "../../../lib/prisma";
export const createCategory = async (data) => {
    if (!data.name) {
        throw new Error("Category name is required");
    }
    const exists = await prisma.category.findUnique({
        where: { name: data.name },
    });
    if (exists) {
        throw new Error("Category already exists");
    }
    return prisma.category.create({
        data: {
            name: data.name,
        },
    });
};
export const getCategories = async () => {
    return prisma.category.findMany();
};
