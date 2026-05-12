import { Router } from "express";
import { verifyDegree } from "../controllers/verification.controller.js";
import { validate } from "../middleware/validate.js";
import { degreeIdSchema } from "../validators/degree.validators.js";

export const verificationRouter = Router();

verificationRouter.get("/degrees/:id", validate(degreeIdSchema), verifyDegree);

