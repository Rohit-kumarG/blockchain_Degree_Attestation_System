import { Degree } from "../models/Degree.js";
import { VerificationAttempt } from "../models/VerificationAttempt.js";
import { createDegreeHash } from "../utils/hashDegree.js";
import { readDegreeFromBlockchain } from "./blockchain.service.js";

export async function verifyDegreeById({ degreeId, req }) {
  const degree = await Degree.findById(degreeId).populate("university");

  if (!degree) {
    await VerificationAttempt.create({
      result: "NOT_FOUND",
      ipAddress: req.ip,
      metadata: { degreeId },
    });

    return { result: "NOT_FOUND", valid: false };
  }

  const computedHash = createDegreeHash({
    studentName: degree.studentName,
    studentEmail: degree.studentEmail,
    studentWallet: degree.studentWallet,
    degreeTitle: degree.degreeTitle,
    department: degree.department,
    graduationYear: degree.graduationYear,
    universityId: degree.university._id,
    ipfsCID: degree.ipfsCID,
    issueDate: degree.issueDate.toISOString(),
  });

  const blockchain = await readDegreeFromBlockchain(degree.degreeHash);
  const hashMatches = computedHash === degree.degreeHash;
  const blockchainMatches = !blockchain.configured || !blockchain.exists || blockchain.ipfsCID === degree.ipfsCID;

  let result = "VALID";

  if (!hashMatches || !blockchainMatches) {
    result = "TAMPERED";
  } else if (degree.revoked || blockchain.revoked) {
    result = "REVOKED";
  }

  await VerificationAttempt.create({
    degree: degree._id,
    degreeHash: degree.degreeHash,
    result,
    verifier: req.user?._id,
    verifierType: req.user?.role || "PUBLIC",
    ipAddress: req.ip,
    metadata: {
      hashMatches,
      blockchain,
    },
  });

  return {
    result,
    valid: result === "VALID",
    degree: {
      id: degree._id,
      studentName: degree.studentName,
      degreeTitle: degree.degreeTitle,
      department: degree.department,
      graduationYear: degree.graduationYear,
      university: degree.university.name,
      issueDate: degree.issueDate,
      ipfsCID: degree.ipfsCID,
      degreeHash: degree.degreeHash,
      revoked: degree.revoked,
      revokedReason: degree.revokedReason,
    },
    checks: {
      hashMatches,
      blockchainConfigured: blockchain.configured,
      blockchainExists: blockchain.exists,
      blockchainValid: blockchain.valid,
    },
  };
}

