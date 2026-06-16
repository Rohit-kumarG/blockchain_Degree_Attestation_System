import { Router } from "express";
import { verifyDegree, verifyDegreeByHashController } from "../controllers/verification.controller.js";
import { validate } from "../middleware/validate.js";
import { degreeIdSchema } from "../validators/degree.validators.js";

export const verificationRouter = Router();

// Verify by MongoDB ID (legacy)
verificationRouter.get("/degrees/:id", validate(degreeIdSchema), verifyDegree);

// Verify by blockchain degree hash (primary public verification)
verificationRouter.get("/hash/:hash", verifyDegreeByHashController);
