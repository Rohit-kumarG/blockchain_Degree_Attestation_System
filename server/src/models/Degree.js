import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    studentWallet: { type: String, required: true, lowercase: true, trim: true },
    degreeTitle: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    issueDate: { type: Date, required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipfsCID: { type: String, required: true, trim: true },
    degreeHash: { type: String, required: true, unique: true, trim: true },
    blockchainTxHash: { type: String, trim: true },
    contractAddress: { type: String, trim: true },
    chainId: { type: Number },
    qrCodeDataUrl: { type: String },
    revoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    revokedReason: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Degree = mongoose.model("Degree", degreeSchema);

