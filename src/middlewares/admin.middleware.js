export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new AppError("Access denied. Admin only", 403));
    }
    next();
}