// auth.service.ts
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
export const registerUser = async (data) => {
    const result = await auth.api.signUpEmail({
        body: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            image: data.image,
        },
    });
    return {
        success: true,
        message: "User registered",
        data: result,
    };
};
export const loginUser = async (data) => {
    const result = await auth.api.signInEmail({
        body: {
            email: data.email,
            password: data.password,
        },
    });
    return {
        success: true,
        message: "Login success",
        data: result,
    };
};
export const getMe = async (headers) => {
    const session = await auth.api.getSession({ headers });
    return {
        success: true,
        data: session?.user,
    };
};
export const updateMe = async (userId, data) => {
    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: data.name,
            image: data.image,
        },
    });
};
// import { Request, Response } from "express";
// import { auth } from "../../../lib/auth";
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const response = await fetch(
//       "http://localhost:5000/api/auth/sign-in/email", // Better Auth route
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(req.body),
//       }
//     );
//     // 🔥 cookie extract
//     const cookies = response.headers.get("set-cookie");
//     if (cookies) {
//       res.setHeader("set-cookie", cookies);
//     }
//     const data = await response.json();
//     res.json({
//       success: true,
//       message: "Login success",
//       data,
//     });
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Login failed",
//     });
//   }
// };
// export const registerUser = async (req: Request, res: Response) => {
//   const result = await auth.api.signUpEmail({
//     body: req.body,
//   });
//   if (result?.headers) {
//     Object.entries(result.headers).forEach(([key, value]) => {
//       res.setHeader(key, value as any);
//     });
//   }
//   res.json({
//     success: true,
//   });
// };
