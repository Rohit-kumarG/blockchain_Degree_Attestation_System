import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required");
  }

  const token = header.slice("Bearer ".length);
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.sub).select("-passwordHash");

  if (!user || !user.active) {
    throw new ApiError(401, "Invalid or inactive user");
  }

  req.user = user;
  next();
});

