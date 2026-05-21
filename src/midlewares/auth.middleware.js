import { auth } from "../../lib/auth";
export var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "STUDENT";
    UserRole["TUTOR"] = "TUTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const authMiddleware = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers,
            });
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = session.user;
            console.log(req.user);
            if (roles.length &&
                !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default authMiddleware;
