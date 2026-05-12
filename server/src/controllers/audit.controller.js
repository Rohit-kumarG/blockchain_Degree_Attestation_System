import { AuditLog } from "../models/AuditLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("actor", "name email role")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ logs });
});

