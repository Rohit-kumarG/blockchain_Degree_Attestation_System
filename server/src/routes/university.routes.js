import { Router } from "express";
import {
  activateUniversity,
  confirmUniversityOnChain,
  createUniversity,
  deactivateUniversity,
  listUniversities,
} from "../controllers/university.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { roles } from "../utils/roles.js";
import {
  createUniversitySchema,
  universityBlockchainConfirmationSchema,
  universityIdSchema,
} from "../validators/university.validators.js";

export const universityRouter = Router();

universityRouter.get("/", authenticate, listUniversities);
universityRouter.post("/", authenticate, authorize(roles.SUPER_ADMIN), validate(createUniversitySchema), createUniversity);
universityRouter.patch(
  "/:id/activate",
  authenticate,
  authorize(roles.SUPER_ADMIN),
  validate(universityIdSchema),
  activateUniversity
);
universityRouter.patch(
  "/:id/deactivate",
  authenticate,
  authorize(roles.SUPER_ADMIN),
  validate(universityIdSchema),
  deactivateUniversity
);
universityRouter.patch(
  "/:id/blockchain-confirmation",
  authenticate,
  authorize(roles.SUPER_ADMIN),
  validate(universityBlockchainConfirmationSchema),
  confirmUniversityOnChain
);
