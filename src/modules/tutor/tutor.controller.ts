import {Request,Response} from "express";
import { createTutor, getTutors, Availability, updateTutor, getTutorById, getTutorSessionsService } from "./tutor.service";
import { prisma } from "../../../lib/prisma";
// export const createTutorController = async(req:Request, res:Response)=>{
//     try{
//         const user = (req as any).user;
// // console.log(user)
// const tutor = await createTutor({
//   user,
//   ...req.body,
// });
// console.log(tutor)
//      res.status(200).json({
//             status:true,
//             message:"Tutor fetched successfully",
//             data:tutor,
//         })
//     }catch(error:any){
//         res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }

export const createTutorController = async (
  req: Request,
  res: Response
  
): Promise<void> => {
  try {
    const user = req.user;

    const tutor = await createTutor({
      user,
      ...req.body,
    });

    res.status(200).json({
      status: true,
      message: "Tutor fetched successfully",
      data: tutor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getTutorsController = async (req:Request, res:Response)=>{
    try{
        const tutors = await getTutors(req.query);
        console.log(tutors)
        res.status(200).json({
            status:true,
            message:"Tutors fetched successfully",
            data:tutors,
        })
    }catch(error:any){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



export const getTutorByIdController = async (req:Request, res:Response)=>{
    try{
        const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
        const tutor = await getTutorById(id);
        res.status(200).json({
            status:true,
            message:"Tutor fetched successfully",
            data:tutor,
        })
    }catch(error:any){
        res.status(500).json({
            success:false,
            message:"This teacher is not found",
        })
    }
}


export const updateTutorProfileController = async(req:Request, res:Response)=>{
    try{
        const user = (req as any).user;
console.log(user)
const tutor = await updateTutor(
  user.id,req.body,
);
     res.status(200).json({
            status:true,
            message:"Profile is updated",
            data:tutor,
        })
    }catch(error:any){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


export const AvailabilityController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const user = (req as any).user;

      const tutorProfile =
        await prisma.tutorProfile.findUnique({
          where: {
            userId: user.id,
          },
        });

      if (!tutorProfile) {
        return res.status(404).json({
          success: false,
          message: "Tutor profile not found",
        });
      }

      const result =
        await Availability(
          tutorProfile.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Availability updated",
        data: result,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };



export const getTutorSessions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
 
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
   
    const sessions = await getTutorSessionsService(user.id);

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


