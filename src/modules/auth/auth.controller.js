"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeController = exports.getMeController = exports.loginUserController = exports.registerUserController = void 0;
const auth_service_1 = require("./auth.service");
const registerUserController = async (req, res) => {
    const result = await (0, auth_service_1.registerUser)(req.body);
    res.status(201).json(result);
};
exports.registerUserController = registerUserController;
const loginUserController = async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body);
    res.status(200).json(result);
};
exports.loginUserController = loginUserController;
const getMeController = async (req, res) => {
    const result = await (0, auth_service_1.getMe)(req.headers);
    res.json(result);
};
exports.getMeController = getMeController;
const updateMeController = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const result = await (0, auth_service_1.updateMe)(user.id, req.body);
    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
};
exports.updateMeController = updateMeController;
