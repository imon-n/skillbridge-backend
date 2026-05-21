import { prisma } from "../../../lib/prisma";
export const createTutor = async (payload) => {
    const { user, bio, hourlyRate, categoryId } = payload;
    // console.log("USER:", user);
    if (!user) {
        throw new Error("Unauthorized");
    }
    const existing = await prisma.tutorProfile.findUnique({
        where: {
            userId: user.id,
        },
    });
    if (existing) {
        throw new Error("Tutor profile already exists");
    }
    return prisma.tutorProfile.create({
        data: {
            bio,
            hourlyRate,
            categoryId,
            userId: user.id,
            image: user.image,
        },
    });
};
export const getTutors = async (query) => {
    console.log(query); // DEBUG
    const { search, category, minRating, maxPrice } = query;
    return prisma.tutorProfile.findMany({
        where: {
            AND: [
                // SEARCH
                search
                    ? {
                        OR: [
                            {
                                user: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                            {
                                bio: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                category: {
                                    name: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    }
                    : {},
                // CATEGORY
                category
                    ? {
                        category: {
                            name: {
                                contains: category,
                                mode: "insensitive",
                            },
                        },
                    }
                    : {},
                // MIN RATING
                minRating
                    ? {
                        rating: {
                            gte: Number(minRating),
                        },
                    }
                    : {},
                // MAX PRICE
                maxPrice
                    ? {
                        hourlyRate: {
                            lte: Number(maxPrice),
                        },
                    }
                    : {},
            ],
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
        },
    });
};
export const getTutorById = async (id) => {
    console.log(id);
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id },
        include: {
            user: true,
            category: true,
        }
    });
    if (!tutor) {
        throw new Error("Tutor not found");
    }
    return tutor;
};
export const updateTutor = async (userId, payload) => {
    return prisma.tutorProfile.update({
        where: { userId },
        data: payload,
    });
};
export const Availability = async (tutorId, payload) => {
    return prisma.availability.create({
        data: {
            tutorId,
            day: payload.day,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });
};
export const getTutorSessionsService = async (userId) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
        },
    });
    if (!tutor) {
        throw new Error("Tutor not found");
    }
    const sessions = await prisma.booking.findMany({
        where: {
            tutorId: tutor.id,
        },
        include: {
            student: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return sessions;
};
