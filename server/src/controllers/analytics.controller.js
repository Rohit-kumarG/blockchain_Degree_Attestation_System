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
    onChainDegrees,
    validVerificationAttempts,
    revokedVerificationAttempts,
    notFoundVerificationAttempts,
    recentVerifications,
    issuanceTrend,
  ] = await Promise.all([
    University.countDocuments(),
    University.countDocuments({ active: true }),
    Degree.countDocuments(),
    Degree.countDocuments({ revoked: true }),
    VerificationAttempt.countDocuments(),
    VerificationAttempt.countDocuments({ result: "TAMPERED" }),
    Degree.countDocuments({ blockchainTxHash: { $exists: true, $ne: "" } }),
    VerificationAttempt.countDocuments({ result: "VALID" }),
    VerificationAttempt.countDocuments({ result: "REVOKED" }),
    VerificationAttempt.countDocuments({ result: "NOT_FOUND" }),
    VerificationAttempt.find()
      .populate("degree", "studentName degreeTitle")
      .sort({ createdAt: -1 })
      .limit(5),
    Degree.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 },
    ]),
  ]);

  const trustScore =
    verificationAttempts === 0
      ? 100
      : Math.max(0, Math.round(((verificationAttempts - fraudAttempts) / verificationAttempts) * 100));

  res.json({
    totalUniversities,
    activeUniversities,
    totalDegrees,
    revokedDegrees,
    validDegrees: totalDegrees - revokedDegrees,
    verificationAttempts,
    fraudAttempts,
    onChainDegrees,
    trustScore,
    verificationBreakdown: [
      { label: "Valid", value: validVerificationAttempts, color: "#047857" },
      { label: "Revoked", value: revokedVerificationAttempts, color: "#d97706" },
      { label: "Tampered", value: fraudAttempts, color: "#dc2626" },
      { label: "Not Found", value: notFoundVerificationAttempts, color: "#64748b" },
    ],
    issuanceTrend: issuanceTrend.map((item) => ({
      label: `${String(item._id.month).padStart(2, "0")}/${item._id.year}`,
      value: item.count,
    })),
    recentVerifications: recentVerifications.map((item) => ({
      id: item._id,
      result: item.result,
      degreeHash: item.degreeHash,
      degreeTitle: item.degree?.degreeTitle,
      studentName: item.degree?.studentName,
      createdAt: item.createdAt,
    })),
  });
});
