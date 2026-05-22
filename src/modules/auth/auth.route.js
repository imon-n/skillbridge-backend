"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../../midlewares/auth.middleware"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.registerUserController);
router.post("/login", auth_controller_1.loginUserController);
router.get("/me", (0, auth_middleware_1.default)(), auth_controller_1.getMeController);
router.patch("/me", (0, auth_middleware_1.default)(), auth_controller_1.updateMeController);
exports.default = router;
