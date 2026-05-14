import express from "express";

import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";
import { getMeController, loginUserController, registerUserController, updateMeController } from "./auth.controller";


const router = express.Router();

router.post("/register", registerUserController)
router.post("/login", loginUserController)
router.get("/me",authMiddleware(), getMeController)
router.patch("/me", authMiddleware(), updateMeController);
export default router;