import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";

export const isAdmin = catchAsyncError(async (req, res, next) => {
  // This middleware assumes 'isAuthenticated' has already run and attached the user to the request.
  if (!req.user) {
    return next(
      new ErrorHandler("Authentication required to check admin status.", 401)
    );
  }

  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        "Forbidden: This resource is accessible by Admins only.",
        403
      )
    );
  }

  // If the user is an Admin, proceed to the next middleware or controller.
  next();
});
