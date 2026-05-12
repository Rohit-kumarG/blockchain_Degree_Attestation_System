import { Degree } from "../models/Degree.js";
import { University } from "../models/University.js";
import { ApiError } from "../utils/ApiError.js";
import { roles } from "../utils/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createDegreeHash } from "../utils/hashDegree.js";
import { writeAuditLog } from "../services/audit.service.js";
import { createMockIpfsCID } from "../services/ipfs.service.js";
import { createDegreeQrCode } from "../services/qr.service.js";

export const issueDegree = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const university = await University.findById(data.universityId);

  if (!university || !university.active) {
    throw new ApiError(404, "Active university not found");
  }

  if (
    req.user.role !== roles.SUPER_ADMIN &&
    req.user.university?.toString() !== university._id.toString()
  ) {
    throw new ApiError(403, "You can only issue degrees for your own university");
  }

  const issueDate = data.issueDate ? new Date(data.issueDate) : new Date();
  const ipfsCID = data.ipfsCID || (await createMockIpfsCID({ ...data, issueDate }));
  const degreeHash = createDegreeHash({
    ...data,
    universityId: university._id,
    ipfsCID,
    issueDate: issueDate.toISOString(),
  });

  const degree = await Degree.create({
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentWallet: data.studentWallet.toLowerCase(),
    degreeTitle: data.degreeTitle,
    department: data.department,
    graduationYear: data.graduationYear,
    issueDate,
    university: university._id,
    issuedBy: req.user._id,
    ipfsCID,
    degreeHash,
  });

  degree.qrCodeDataUrl = await createDegreeQrCode(degree._id);
  await degree.save();

  await writeAuditLog({
    req,
    action: "DEGREE_ISSUED_OFFCHAIN",
    targetType: "Degree",
    targetId: degree._id.toString(),
    metadata: { degreeHash, university: university.name },
  });

  res.status(201).json({ degree });
});

export const listDegrees = asyncHandler(async (req, res) => {
  const query = {};

  if ([roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF].includes(req.user.role)) {
    query.university = req.user.university;
  }

  if (req.user.role === roles.STUDENT) {
    query.studentEmail = req.user.email;
  }

  const degrees = await Degree.find(query).populate("university", "name code").sort({ createdAt: -1 });
  res.json({ degrees });
});

export const getDegree = asyncHandler(async (req, res) => {
  const degree = await Degree.findById(req.validated.params.id).populate("university", "name code walletAddress");

  if (!degree) {
    throw new ApiError(404, "Degree not found");
  }

  res.json({ degree });
});

export const revokeDegree = asyncHandler(async (req, res) => {
  const degree = await Degree.findById(req.validated.params.id).populate("university");

  if (!degree) {
    throw new ApiError(404, "Degree not found");
  }

  if (
    req.user.role !== roles.SUPER_ADMIN &&
    req.user.university?.toString() !== degree.university._id.toString()
  ) {
    throw new ApiError(403, "You can only revoke degrees for your own university");
  }

  degree.revoked = true;
  degree.revokedAt = new Date();
  degree.revokedReason = req.validated.body.reason;
  await degree.save();

  await writeAuditLog({
    req,
    action: "DEGREE_REVOKED_OFFCHAIN",
    targetType: "Degree",
    targetId: degree._id.toString(),
    metadata: { reason: degree.revokedReason },
  });

  res.json({ degree });
});

export const confirmDegreeOnChain = asyncHandler(async (req, res) => {
  const degree = await Degree.findById(req.validated.params.id).populate("university");

  if (!degree) {
    throw new ApiError(404, "Degree not found");
  }

  if (
    req.user.role !== roles.SUPER_ADMIN &&
    req.user.university?.toString() !== degree.university._id.toString()
  ) {
    throw new ApiError(403, "You can only confirm degrees for your own university");
  }

  degree.blockchainTxHash = req.validated.body.blockchainTxHash;
  degree.contractAddress = req.validated.body.contractAddress.toLowerCase();
  degree.chainId = req.validated.body.chainId;
  await degree.save();

  await writeAuditLog({
    req,
    action: "DEGREE_CONFIRMED_ON_CHAIN",
    targetType: "Degree",
    targetId: degree._id.toString(),
    metadata: {
      blockchainTxHash: degree.blockchainTxHash,
      contractAddress: degree.contractAddress,
      chainId: degree.chainId,
    },
  });

  res.json({ degree });
});
