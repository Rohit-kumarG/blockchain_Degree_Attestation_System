import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { roles } from "../utils/roles.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/dashboard",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.AUDITOR),
  getDashboardAnalytics
);
