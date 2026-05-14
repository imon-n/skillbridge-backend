// admin.controller.ts

import { Request, Response } from "express";
import {
  getUsersService,
  updateUserStatusService,
} from "./admin.service";

export const getUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getUsersService();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUserStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await updateUserStatusService(
      id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};