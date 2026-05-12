import crypto from "crypto";

export function canonicalizeDegreePayload(payload) {
  return JSON.stringify({
    studentName: payload.studentName,
    studentEmail: payload.studentEmail,
    studentWallet: payload.studentWallet,
    degreeTitle: payload.degreeTitle,
    department: payload.department,
    graduationYear: payload.graduationYear,
    universityId: String(payload.universityId),
    ipfsCID: payload.ipfsCID,
    issueDate: payload.issueDate,
  });
}

export function createDegreeHash(payload) {
  return `0x${crypto.createHash("sha256").update(canonicalizeDegreePayload(payload)).digest("hex")}`;
}

