import mongoose from "mongoose";

const verificationAttemptSchema = new mongoose.Schema(
  {
    degree: { type: mongoose.Schema.Types.ObjectId, ref: "Degree" },
    degreeHash: { type: String, trim: true },
    result: {
      type: String,
      enum: ["VALID", "REVOKED", "TAMPERED", "NOT_FOUND", "ERROR"],
      required: true,
    },
    verifierType: { type: String, trim: true },
    verifier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ipAddress: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const VerificationAttempt = mongoose.model("VerificationAttempt", verificationAttemptSchema);

