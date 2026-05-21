import express from "express";
import { createBooking, getAllBookingsController, getBookingById, getMyBookings } from "./booking.controller";
import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";
const router = express.Router();
router.post("/bookings", authMiddleware(UserRole.STUDENT), createBooking);
router.get("/admin/bookings", authMiddleware(UserRole.ADMIN), getAllBookingsController);
router.get("/bookings", authMiddleware(), getMyBookings);
router.get("/bookings/:id", authMiddleware(), getBookingById);
export default router;
