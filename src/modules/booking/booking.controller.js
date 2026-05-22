"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsController = exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const BookingService = __importStar(require("./booking.service"));
const createBooking = async (req, res) => {
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
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
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
exports.getMyBookings = getMyBookings;
const getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const bookings = await BookingService.getBookingById(id);
        res.json({ success: true, data: bookings });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getBookingById = getBookingById;
const getAllBookingsController = async (req, res) => {
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
exports.getAllBookingsController = getAllBookingsController;
