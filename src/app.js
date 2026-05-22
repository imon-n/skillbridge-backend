"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_1 = require("better-auth/node");
const auth_1 = require("../lib/auth");
const cors_1 = __importDefault(require("cors"));
const tutor_route_1 = __importDefault(require("./modules/tutor/tutor.route"));
const category_route_1 = __importDefault(require("./modules/category/category.route"));
const booking_route_1 = __importDefault(require("./modules/booking/booking.route"));
const review_route_1 = __importDefault(require("./modules/review/review.route"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const admin_route_1 = __importDefault(require("./modules/admin/admin.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}));
app.use("/api/auth", (0, node_1.toNodeHandler)(auth_1.auth));
app.use("/api", auth_route_1.default);
// other routes
app.use("/api", tutor_route_1.default);
app.use("/api", category_route_1.default);
app.use("/api", booking_route_1.default);
app.use("/api", review_route_1.default);
app.use("/api", admin_route_1.default);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
exports.default = app;
