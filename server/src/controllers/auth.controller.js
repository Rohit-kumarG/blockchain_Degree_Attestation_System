import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { roles } from "../utils/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { comparePassword, createAccessToken, hashPassword } from "../services/auth.service.js";
import { writeAuditLog } from "../services/audit.service.js";

export const register = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const requestedRole = data.role || roles.STUDENT;

  if (requestedRole !== roles.STUDENT && requestedRole !== roles.EMPLOYER && req.user?.role !== roles.SUPER_ADMIN) {
    throw new ApiError(403, "Only super admin can create privileged users");
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: await hashPassword(data.password),
    role: requestedRole,
    walletAddress: data.walletAddress?.toLowerCase(),
    university: data.university,
  });

  await writeAuditLog({
    req,
    action: "USER_REGISTERED",
    targetType: "User",
    targetId: user._id.toString(),
    metadata: { role: user.role },
  });

  res.status(201).json({
    user: sanitizeUser(user),
    token: createAccessToken(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.active) {
    throw new ApiError(403, "User account is inactive");
  }

  await writeAuditLog({
    req,
    action: "USER_LOGIN",
    targetType: "User",
    targetId: user._id.toString(),
  });

  res.json({
    user: sanitizeUser(user),
    token: createAccessToken(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress,
    university: user.university,
    active: user.active,
  };
}

