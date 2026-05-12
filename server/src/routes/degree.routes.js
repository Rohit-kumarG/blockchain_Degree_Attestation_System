import { Router } from "express";
import {
  confirmDegreeOnChain,
  getDegree,
  issueDegree,
  listDegrees,
  revokeDegree,
} from "../controllers/degree.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { roles } from "../utils/roles.js";
import {
  blockchainConfirmationSchema,
  degreeIdSchema,
  issueDegreeSchema,
  revokeDegreeSchema,
} from "../validators/degree.validators.js";

export const degreeRouter = Router();

degreeRouter.get("/", authenticate, listDegrees);
degreeRouter.get("/:id", authenticate, validate(degreeIdSchema), getDegree);
degreeRouter.post(
  "/",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  validate(issueDegreeSchema),
  issueDegree
);
degreeRouter.patch(
  "/:id/revoke",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN),
  validate(revokeDegreeSchema),
  revokeDegree
);
degreeRouter.patch(
  "/:id/blockchain-confirmation",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  validate(blockchainConfirmationSchema),
  confirmDegreeOnChain
);
