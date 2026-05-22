import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";

export enum UserRole {
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });



      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      (req as any).user = session.user;
console.log((req as any).user )
      if (
  roles.length &&
  !roles.includes((req as any).user.role)
) {
  return res.status(403).json({
    message: "Forbidden",
  });
}

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;


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