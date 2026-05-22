"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTutorSessions = exports.AvailabilityController = exports.updateTutorProfileController = exports.getTutorByIdController = exports.getTutorsController = exports.createTutorController = void 0;
const tutor_service_1 = require("./tutor.service");
const prisma_1 = require("../../../lib/prisma");
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
const createTutorController = async (req, res) => {
    try {
        const user = req.user;
        const tutor = await (0, tutor_service_1.createTutor)({
            user,
            ...req.body,
        });
        res.status(200).json({
            status: true,
            message: "Tutor fetched successfully",
            data: tutor,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createTutorController = createTutorController;
const getTutorsController = async (req, res) => {
    try {
        const tutors = await (0, tutor_service_1.getTutors)(req.query);
        console.log(tutors);
        res.status(200).json({
            status: true,
            message: "Tutors fetched successfully",
            data: tutors,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getTutorsController = getTutorsController;
const getTutorByIdController = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const tutor = await (0, tutor_service_1.getTutorById)(id);
        res.status(200).json({
            status: true,
            message: "Tutor fetched successfully",
            data: tutor,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "This teacher is not found",
        });
    }
};
exports.getTutorByIdController = getTutorByIdController;
const updateTutorProfileController = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const tutor = await (0, tutor_service_1.updateTutor)(user.id, req.body);
        res.status(200).json({
            status: true,
            message: "Profile is updated",
            data: tutor,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateTutorProfileController = updateTutorProfileController;
const AvailabilityController = async (req, res) => {
    try {
        const user = req.user;
        const tutorProfile = await prisma_1.prisma.tutorProfile.findUnique({
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
        const result = await (0, tutor_service_1.Availability)(tutorProfile.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Availability updated",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.AvailabilityController = AvailabilityController;
const getTutorSessions = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const sessions = await (0, tutor_service_1.getTutorSessionsService)(user.id);
        return res.status(200).json({
            success: true,
            data: sessions,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getTutorSessions = getTutorSessions;
