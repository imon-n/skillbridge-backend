import * as ReviewService from "./review.service";

export const createReview = async(req:Request, res:Response)=>{
    try{
        const user = (req as any).user;
console.log(user)
const review = await ReviewService.createReview({
 userId: user.id,
  ...req.body,
});
  return  res.status(200).json({
            status:true,
            message:"Review created",
            data:review,
        })
    }catch(error:any){
     return   res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

import { Request, Response } from "express";
import { getPublicTutorReviewsService } from "./review.service";

export const getPublicTutorReviews = async (req: Request, res: Response) => {
  try {
//     const { tutorUserId } = req.params;
// console.log(tutorUserId)
const tutorUserIdRaw = req.params.tutorUserId;

const tutorUserId = Array.isArray(tutorUserIdRaw)
  ? tutorUserIdRaw[0]
  : tutorUserIdRaw;
    const reviews = await getPublicTutorReviewsService(tutorUserId);

    return res.status(200).json({
      success: true,
      message: "Tutor reviews fetched successfully",
      data: reviews,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

