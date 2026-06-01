import { prisma } from "../../../lib/prisma";


const convertToMinutes = (time: string) => {
  const [hourMinute, modifier] = time.split(" ");
  let [hours, minutes] = hourMinute.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export const createBooking = async (payload: any) => {

  const availability = await prisma.availability.findFirst({
    where: {
      tutorId: payload.tutorId,
      day: payload.day,
    },
  });

  if (!availability) {
    throw new Error("Tutor not available on this day");
  }

  const bookingTime = convertToMinutes(payload.time);
  const startTime = convertToMinutes(availability.startTime);
  const endTime = convertToMinutes(availability.endTime);

  if (
    bookingTime < startTime ||
    bookingTime > endTime
  ) {
    throw new Error("Tutor not available");
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      tutorId: payload.tutorId,
      date: payload.date,
      time: payload.time,
    },
  });

  if (existingBooking) {
    throw new Error("This slot already booked");
  }

  // Get tutor profile to calculate amount
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorId },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const { day, ...bookingData } = payload;

  return prisma.booking.create({
    data: {
      ...bookingData,
      amount: tutor.hourlyRate,
      status: "CONFIRMED", // Booking is pending payment
    },
  });
};

export const createBookingPendingPayment = async (payload: any) => {
  const availability = await prisma.availability.findFirst({
    where: {
      tutorId: payload.tutorId,
      day: payload.day,
    },
  });

  if (!availability) {
    throw new Error("Tutor not available on this day");
  }

  const bookingTime = convertToMinutes(payload.time);
  const startTime = convertToMinutes(availability.startTime);
  const endTime = convertToMinutes(availability.endTime);

  if (
    bookingTime < startTime ||
    bookingTime > endTime
  ) {
    throw new Error("Tutor not available");
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      tutorId: payload.tutorId,
      date: payload.date,
      time: payload.time,
    },
  });

  if (existingBooking) {
    throw new Error("This slot already booked");
  }

  // Get tutor profile to calculate amount
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorId },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const { day, ...bookingData } = payload;

  return prisma.booking.create({
    data: {
      ...bookingData,
      amount: tutor.hourlyRate,
      status: "CONFIRMED", // Will be updated after payment
    },
    include: {
      tutor: {
        include: {
          user: true,
          category: true,
        },
      },
    },
  });
};

export const getBookingAmount = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking.tutor.hourlyRate;
};

export const getMyBookings = async (userId: string) => {
  return await prisma.booking.findMany({
    where: {
      studentId: userId,
    },

    include: {
      tutor: {
        include: {
          user: true,
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      tutor: true,
      student: true,
    },
  });
};


export const getAllBookingsService = async () => {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // collect ids
  const userIds = bookings.map((b) => b.studentId);
  const tutorIds = bookings.map((b) => b.tutorId);

  // fetch users
  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  });

  // fetch tutors
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      id: { in: tutorIds },
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  // merge data
  const result = bookings.map((b) => {
    return {
      ...b,
      student: users.find((u) => u.id === b.studentId),
      tutor: tutors.find((t) => t.id === b.tutorId),
    };
  });

  return result;
};