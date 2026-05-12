import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyDegreeById } from "../services/verification.service.js";

export const verifyDegree = asyncHandler(async (req, res) => {
  const result = await verifyDegreeById({
    degreeId: req.validated.params.id,
    req,
  });

  res.json(result);
});

