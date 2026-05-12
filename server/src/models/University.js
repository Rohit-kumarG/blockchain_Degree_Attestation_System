import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    walletAddress: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
    blockchainApproved: { type: Boolean, default: false },
    approvedTxHash: { type: String, trim: true },
  },
  { timestamps: true }
);

export const University = mongoose.model("University", universitySchema);

