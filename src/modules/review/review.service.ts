import { prisma } from "../../../lib/prisma";

export const createReview = async (payload: any) => {

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: payload.userId,
      tutorId: payload.tutorId,
    },
  });

  // UPDATE REVIEW IF EXISTS
  if (existingReview) {

    return prisma.review.update({
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
  return prisma.review.create({
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

export const getTutorReviewsService = async (userId: string) => {
 const tutor = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  console.log(tutor.id)
  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const sessions = await prisma.review.findMany({
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
  }


export const getPublicTutorReviewsService = async (tutorUserId: string) => {
  // find tutor profile using userId
  const tutor = await prisma.tutorProfile.findUnique({
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
  const reviews = await prisma.review.findMany({
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