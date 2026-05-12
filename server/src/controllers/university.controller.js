import { University } from "../models/University.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { writeAuditLog } from "../services/audit.service.js";

export const createUniversity = asyncHandler(async (req, res) => {
  const data = req.validated.body;

  const university = await University.create({
    name: data.name,
    code: data.code,
    walletAddress: data.walletAddress.toLowerCase(),
  });

  await writeAuditLog({
    req,
    action: "UNIVERSITY_CREATED",
    targetType: "University",
    targetId: university._id.toString(),
    metadata: { code: university.code },
  });

  res.status(201).json({ university });
});

export const listUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find().sort({ createdAt: -1 });
  res.json({ universities });
});

export const activateUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.validated.params.id);

  if (!university) {
    throw new ApiError(404, "University not found");
  }

  university.active = true;
  await university.save();

  await writeAuditLog({
    req,
    action: "UNIVERSITY_ACTIVATED",
    targetType: "University",
    targetId: university._id.toString(),
  });

  res.json({ university });
});

export const deactivateUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.validated.params.id);

  if (!university) {
    throw new ApiError(404, "University not found");
  }

  university.active = false;
  await university.save();

  await writeAuditLog({
    req,
    action: "UNIVERSITY_DEACTIVATED",
    targetType: "University",
    targetId: university._id.toString(),
  });

  res.json({ university });
});

