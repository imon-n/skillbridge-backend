"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const auth_1 = require("../../lib/auth");
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "STUDENT";
    UserRole["TUTOR"] = "TUTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }
const authMiddleware = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await auth_1.auth.api.getSession({
                headers: req.headers,
            });
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = session.user;
            console.log(req.user);
            if (roles.length &&
                !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = authMiddleware;
// import { Request, Response, NextFunction } from "express";
// import { auth } from "../../lib/auth";
// import { User } from "../../generated/prisma/client";
// import { Role } from "../../generated/prisma/client";
// export enum UserRole {
//   STUDENT = "STUDENT",
//   TUTOR = "TUTOR",
//   ADMIN = "ADMIN",
// }
// // declare global {
// //   namespace Express {
// //     interface Request {
// //       user?: any;
// //     }
// //   }
// // }
// const authMiddleware = (...roles: UserRole[]) => {
//   return async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const session = await auth.api.getSession({
//         headers: req.headers as Record<string, string>,
//       });
//       if (!session) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//       }
//        req.user = session.user as User;
//       if (roles.length && !roles.includes(req.user.role as Role)) {
//         res.status(403).json({ message: "Forbidden" });
//         return;
//       }
//       next();
//     } catch (error) {
//       next(error); // ✅ now valid
//     }
//   };
// };
// export default authMiddleware;
