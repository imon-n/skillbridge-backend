"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsService = exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const prisma_1 = require("../../../lib/prisma");
const convertToMinutes = (time) => {
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
const createBooking = async (payload) => {
    const availability = await prisma_1.prisma.availability.findFirst({
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
    if (bookingTime < startTime ||
        bookingTime > endTime) {
        throw new Error("Tutor not available");
    }
    const existingBooking = await prisma_1.prisma.booking.findFirst({
        where: {
            tutorId: payload.tutorId,
            date: payload.date,
            time: payload.time,
        },
    });
    if (existingBooking) {
        throw new Error("This slot already booked");
    }
    const { day, ...bookingData } = payload;
    return prisma_1.prisma.booking.create({
        data: bookingData,
    });
};
exports.createBooking = createBooking;
const getMyBookings = async (userId) => {
    return await prisma_1.prisma.booking.findMany({
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
exports.getMyBookings = getMyBookings;
const getBookingById = async (id) => {
    return prisma_1.prisma.booking.findUnique({
        where: { id },
        include: {
            tutor: true,
            student: true,
        },
    });
};
exports.getBookingById = getBookingById;
const getAllBookingsService = async () => {
    const bookings = await prisma_1.prisma.booking.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    // collect ids
    const userIds = bookings.map((b) => b.studentId);
    const tutorIds = bookings.map((b) => b.tutorId);
    // fetch users
    const users = await prisma_1.prisma.user.findMany({
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
    const tutors = await prisma_1.prisma.tutorProfile.findMany({
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
exports.getAllBookingsService = getAllBookingsService;
