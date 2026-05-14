import express from "express";

import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";
import { createReview, getPublicTutorReviews, getTutorReviews } from "./review.controller";

const router = express.Router();

router.post("/reviews", authMiddleware(),createReview);
router.get(
  "/reviews",
   authMiddleware(UserRole.TUTOR),
  getTutorReviews
);
router.get("/reviews/:tutorUserId", getPublicTutorReviews);
export default router;