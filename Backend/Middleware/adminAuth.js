import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";

const requireRole = (...allowedRoles) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required.", 401));
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      const msg =
        allowedRoles.length === 1
          ? `Forbidden: Requires ${allowedRoles[0]} access.`
          : `Forbidden: Requires one of [${allowedRoles.join(", ")}].`;
      return next(new ErrorHandler(msg, 403));
    }

    next();
  });

export const isAdmin = requireRole("Admin", "PrimeAdmin");
export const isPrimeAdmin = requireRole("PrimeAdmin");
export const isApprovedAdmin = catchAsyncError(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Authentication required.", 401));
  }
  if (req.user.role === "PrimeAdmin") return next();

  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Forbidden: Admins only.", 403));
  }
  const status = req.user.adminRequest?.status || "approved";
  if (status !== "approved") {
    return next(new ErrorHandler("Admin access pending approval.", 403));
  }

  next();
});
