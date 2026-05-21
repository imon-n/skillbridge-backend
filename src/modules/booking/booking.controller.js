import * as BookingService from "./booking.service";
export const createBooking = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const booking = await BookingService.createBooking({
            studentId: user.id,
            ...req.body,
        });
        res.status(201).json({
            success: true,
            message: "Booking created",
            data: booking,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getMyBookings = async (req, res) => {
    try {
        const user = req.user;
        // ✅ Check user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // ✅ Get only logged in user's bookings
        const bookings = await BookingService.getMyBookings(user.id);
        return res.status(200).json({
            success: true,
            message: "My bookings fetched successfully",
            data: bookings,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
};
export const getBookingById = async (req, res) => {
    try {
        const user = req.user;
        const bookings = await BookingService.getBookingById(req.params.id);
        res.json({ success: true, data: bookings });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getAllBookingsController = async (req, res) => {
    try {
        const bookings = await BookingService.getAllBookingsService();
        return res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch bookings",
        });
    }
};
