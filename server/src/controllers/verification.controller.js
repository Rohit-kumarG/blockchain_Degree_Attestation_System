import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyDegreeById, verifyDegreeByHash } from "../services/verification.service.js";

export const verifyDegree = asyncHandler(async (req, res) => {
  const result = await verifyDegreeById({
    degreeId: req.validated.params.id,
    req,
  });
  res.json(result);
});

export const verifyDegreeByHashController = asyncHandler(async (req, res) => {
  const result = await verifyDegreeByHash({
    degreeHash: req.params.hash,
    req,
  });
  res.json(result);
});
