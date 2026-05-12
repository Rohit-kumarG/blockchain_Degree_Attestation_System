import { AuditLog } from "../models/AuditLog.js";

export async function writeAuditLog({ req, action, targetType, targetId, metadata = {} }) {
  await AuditLog.create({
    action,
    actor: req.user?._id,
    role: req.user?.role,
    targetType,
    targetId,
    metadata,
    ipAddress: req.ip,
  });
}

