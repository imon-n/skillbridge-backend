import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";

export enum UserRole {
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

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