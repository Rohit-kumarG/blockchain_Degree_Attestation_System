import { Router } from "express";
import { listAuditLogs } from "../controllers/audit.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { roles } from "../utils/roles.js";

export const auditRouter = Router();

auditRouter.get("/", authenticate, authorize(roles.SUPER_ADMIN, roles.AUDITOR), listAuditLogs);

