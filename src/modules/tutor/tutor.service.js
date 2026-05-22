"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTutorSessionsService = exports.Availability = exports.updateTutor = exports.getTutorById = exports.getTutors = exports.createTutor = void 0;
const prisma_1 = require("../../../lib/prisma");
const createTutor = async (payload) => {
    const { user, bio, hourlyRate, categoryId } = payload;
    // console.log("USER:", user);
    if (!user) {
        throw new Error("Unauthorized");
    }
    const existing = await prisma_1.prisma.tutorProfile.findUnique({
        where: {
            userId: user.id,
        },
    });
    if (existing) {
        throw new Error("Tutor profile already exists");
    }
    return prisma_1.prisma.tutorProfile.create({
        data: {
            bio,
            hourlyRate,
            categoryId,
            userId: user.id,
            image: user.image,
        },
    });
};
exports.createTutor = createTutor;
const getTutors = async (query) => {
    console.log(query); // DEBUG
    const { search, category, minRating, maxPrice } = query;
    return prisma_1.prisma.tutorProfile.findMany({
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
exports.getTutors = getTutors;
const getTutorById = async (id) => {
    console.log(id);
    const tutor = await prisma_1.prisma.tutorProfile.findUnique({
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
exports.getTutorById = getTutorById;
const updateTutor = async (userId, payload) => {
    return prisma_1.prisma.tutorProfile.update({
        where: { userId },
        data: payload,
    });
};
exports.updateTutor = updateTutor;
const Availability = async (tutorId, payload) => {
    return prisma_1.prisma.availability.create({
        data: {
            tutorId,
            day: payload.day,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });
};
exports.Availability = Availability;
const getTutorSessionsService = async (userId) => {
    const tutor = await prisma_1.prisma.tutorProfile.findUnique({
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
    const sessions = await prisma_1.prisma.booking.findMany({
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
exports.getTutorSessionsService = getTutorSessionsService;
