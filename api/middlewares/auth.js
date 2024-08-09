import { User } from "../models/user.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return next(new ErrorHandler("User Not Authorized", 401));
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   req.user = await User.findById(decoded.id);

//   next();
// });

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('User Not Authorized', 401));
  }

  try {
    const secretKey = '!@#$%^&*()';
    // console.log("JWT_SECRET_KEY (verification):", secretKey);
    // console.log("Token to verify:", token);
    const decoded = jwt.verify(token, secretKey);
    // console.log('Decoded token:', decoded);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler('User Not Authorized', 401));
    }

    // console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.log('JWT verification failed:', error);
    return next(new ErrorHandler('Json Web Token is invalid, Try again!', 401));
  }
});
