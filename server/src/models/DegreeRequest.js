import mongoose from "mongoose";

const degreeRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    studentWallet: { type: String, required: true, lowercase: true, trim: true },
    degreeTitle: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    documentUrl: { type: String, required: true },
    rollNumber: { type: String, default: "" },
    
    // Personal Details
    fatherName: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    address: { type: String, default: "" },
    cnicName: { type: String, default: "" },
    
    // Educational History
    qualifications: [
      {
        level: { type: String, default: "" },
        degreeTitle: { type: String, default: "" },
        boardOrUniversity: { type: String, default: "" },
        campus: { type: String, default: "" },
        session: { type: String, default: "" },
        rollNumber: { type: String, default: "" },
        duration: { type: String, default: "" },
      }
    ],

    // Attestation Selection & Payments
    attestDegree: { type: Boolean, default: false },
    attestTranscript: { type: Boolean, default: false },
    calculatedFee: { type: Number, default: 0 },
    consumerNumber: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    metricPercentage: { type: Number, default: 0 },
    interPercentage: { type: Number, default: 0 },
    cgpa: { type: Number, default: 0 },
    nicExpiryDate: { type: Date },
    paymentMethod: { type: String, enum: ["METAMASK", "BITCOIN", "ONELINK"], default: "METAMASK" },
    paymentSlipUrl: { type: String, default: "" },
    bitcoinTxHash: { type: String, default: "" },
    metricMarksheetUrl: { type: String, default: "" },
    interMarksheetUrl: { type: String, default: "" },
    transcriptUrl: { type: String, default: "" },
    nicFrontUrl: { type: String, default: "" },
    nicBackUrl: { type: String, default: "" },
    yoloStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "FAILED"],
      default: "PENDING",
    },
    yoloDetections: [
      {
        label: { type: String },
        confidence: { type: Number },
        bbox: [{ type: Number }],
      },
    ],
    ocrStatus: {
      type: String,
      enum: ["PENDING", "PASSED", "FAILED"],
      default: "PENDING",
    },
    ocrDetails: {
      extractedMetricPercentage: { type: Number },
      extractedInterPercentage: { type: Number },
      extractedCgpa: { type: Number },
      extractedNicExpiry: { type: Date },
      extractedNicNumber: { type: String },
      failureReason: { type: String },
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
    paymentTxHash: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: [
        "PENDING_VERIFICATION",
        "VERIFICATION_FAILED",
        "PENDING_PAYMENT",
        "PAID",
        "ISSUED",
        "REJECTED",
      ],
      default: "PENDING_VERIFICATION",
    },
    degreeHash: { type: String, unique: true, sparse: true },
    ipfsCID: { type: String, trim: true },
    issueDate: { type: Date },
  },
  { timestamps: true }
);

export const DegreeRequest = mongoose.model("DegreeRequest", degreeRequestSchema);
