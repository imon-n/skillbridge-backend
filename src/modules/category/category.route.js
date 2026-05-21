import express from "express";
import { createCategories, getCategories, } from "./category.controller";
import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";
const router = express.Router();
router.post("/categories", authMiddleware(UserRole.ADMIN), createCategories);
router.get("/categories", getCategories);
export default router;
