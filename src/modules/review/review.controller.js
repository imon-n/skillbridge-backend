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
exports.getPublicTutorReviews = exports.getTutorReviews = exports.createReview = void 0;
const ReviewService = __importStar(require("./review.service"));
const createReview = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const review = await ReviewService.createReview({
            userId: user.id,
            ...req.body,
        });
        return res.status(200).json({
            status: true,
            message: "Review created",
            data: review,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createReview = createReview;
const getTutorReviews = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const reviews = await ReviewService.getTutorReviewsService(user.id);
        return res.status(200).json({
            success: true,
            data: reviews,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getTutorReviews = getTutorReviews;
const review_service_1 = require("./review.service");
const getPublicTutorReviews = async (req, res) => {
    try {
        //     const { tutorUserId } = req.params;
        // console.log(tutorUserId)
        const tutorUserIdRaw = req.params.tutorUserId;
        const tutorUserId = Array.isArray(tutorUserIdRaw)
            ? tutorUserIdRaw[0]
            : tutorUserIdRaw;
        const reviews = await (0, review_service_1.getPublicTutorReviewsService)(tutorUserId);
        return res.status(200).json({
            success: true,
            message: "Tutor reviews fetched successfully",
            data: reviews,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getPublicTutorReviews = getPublicTutorReviews;
