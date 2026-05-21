// admin.routes.ts
import express from "express";
import authMiddleware, { UserRole, } from "../../midlewares/auth.middleware";
import { getUsersController, updateUserStatusController, } from "./admin.controller";
const router = express.Router();
router.get("/admin/users", authMiddleware(UserRole.ADMIN), getUsersController);
router.patch("/admin/users/:id", authMiddleware(UserRole.ADMIN), updateUserStatusController);
export default router;
