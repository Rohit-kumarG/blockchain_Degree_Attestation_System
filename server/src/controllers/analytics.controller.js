import { Degree } from "../models/Degree.js";
import { University } from "../models/University.js";
import { VerificationAttempt } from "../models/VerificationAttempt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUniversities,
    activeUniversities,
    totalDegrees,
    revokedDegrees,
    verificationAttempts,
    fraudAttempts,
  ] = await Promise.all([
    University.countDocuments(),
    University.countDocuments({ active: true }),
    Degree.countDocuments(),
    Degree.countDocuments({ revoked: true }),
    VerificationAttempt.countDocuments(),
    VerificationAttempt.countDocuments({ result: "TAMPERED" }),
  ]);

  res.json({
    totalUniversities,
    activeUniversities,
    totalDegrees,
    revokedDegrees,
    validDegrees: totalDegrees - revokedDegrees,
    verificationAttempts,
    fraudAttempts,
  });
});

