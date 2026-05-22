"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const auth_middleware_1 = require("../midlewares/auth.middleware");
async function seedAdmin() {
    try {
        console.log("***** Admin Seeding Started....");
        const adminData = {
            name: "Admin2 Saheb",
            email: "admin2@admin.com",
            role: auth_middleware_1.UserRole.ADMIN,
            password: "admin1234"
        };
        console.log("***** Checking Admin Exist or not");
        // check user exist on db or not
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if (existingUser) {
            throw new Error("User already exists!!");
        }
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        });
        if (signUpAdmin.ok) {
            console.log("**** Admin created");
            await prisma_1.prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
            console.log("**** Email verification status updated!");
        }
        console.log("******* SUCCESS ******");
    }
    catch (error) {
        console.error(error);
    }
}
seedAdmin();
