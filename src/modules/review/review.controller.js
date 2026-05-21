import * as ReviewService from "./review.service";
export const createReview = async (req, res) => {
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
export const getTutorReviews = async (req, res) => {
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
import { getPublicTutorReviewsService } from "./review.service";
export const getPublicTutorReviews = async (req, res) => {
    try {
        const { tutorUserId } = req.params;
        console.log(tutorUserId);
        const reviews = await getPublicTutorReviewsService(tutorUserId);
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
