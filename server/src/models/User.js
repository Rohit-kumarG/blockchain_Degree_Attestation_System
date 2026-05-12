import mongoose from "mongoose";
import { roles } from "../utils/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(roles), required: true },
    walletAddress: { type: String, trim: true, lowercase: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

