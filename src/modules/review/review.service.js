"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicTutorReviewsService = exports.getTutorReviewsService = exports.createReview = void 0;
const prisma_1 = require("../../../lib/prisma");
const createReview = async (payload) => {
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            userId: payload.userId,
            tutorId: payload.tutorId,
        },
    });
    // UPDATE REVIEW IF EXISTS
    if (existingReview) {
        return prisma_1.prisma.review.update({
            where: {
                id: existingReview.id,
            },
            data: {
                comment: payload.comment,
                rating: payload.rating,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }
    // CREATE NEW REVIEW
    return prisma_1.prisma.review.create({
        data: payload,
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
};
exports.createReview = createReview;
const getTutorReviewsService = async (userId) => {
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
    const sessions = await prisma_1.prisma.review.findMany({
        where: {
            tutorId: tutor.id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return sessions;
};
exports.getTutorReviewsService = getTutorReviewsService;
const getPublicTutorReviewsService = async (tutorUserId) => {
    // find tutor profile using userId
    const tutor = await prisma_1.prisma.tutorProfile.findUnique({
        where: {
            id: tutorUserId,
        },
        select: {
            id: true,
        },
    });
    if (!tutor) {
        throw new Error("Tutor not found");
    }
    // get all reviews for this tutor
    const reviews = await prisma_1.prisma.review.findMany({
        where: {
            tutorId: tutor.id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
};
exports.getPublicTutorReviewsService = getPublicTutorReviewsService;
