// auth.controller.ts
import { Request, Response } from "express";
import { getMe, loginUser, registerUser, updateMe } from "./auth.service";



export const registerUserController = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
};

export const loginUserController = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
};

export const getMeController = async (req: Request, res: Response) => {
  const result = await getMe(req.headers);
  res.json(result);
};


export const updateMeController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await updateMe(user.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};