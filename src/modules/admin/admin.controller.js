"use strict";
// admin.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatusController = exports.getUsersController = void 0;
const admin_service_1 = require("./admin.service");
const getUsersController = async (req, res) => {
    try {
        const users = await (0, admin_service_1.getUsersService)();
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getUsersController = getUsersController;
const updateUserStatusController = async (req, res) => {
    try {
        // const { id } = req.params; // this line i change for deployment
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { status } = req.body;
        const updatedUser = await (0, admin_service_1.updateUserStatusService)(id, status);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};
exports.updateUserStatusController = updateUserStatusController;
