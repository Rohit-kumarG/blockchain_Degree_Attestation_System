import fs from "fs";
import { DegreeRequest } from "../models/DegreeRequest.js";
import { Degree } from "../models/Degree.js";
import { University } from "../models/University.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { roles } from "../utils/roles.js";
import { analyzeDocument } from "../services/yoloService.js";
import {
  validateRequestDocuments,
  performOcr,
  extractPercentage,
  extractCgpa,
  extractNicExpiry,
  extractNicNumber,
  extractDob,
  extractFatherName,
  extractGender,
  extractAddress
} from "../services/ocrService.js";
import { createDegreeHash } from "../utils/hashDegree.js";
import { createDegreeMetadataCID } from "../services/ipfs.service.js";
import { createDegreeQrCode } from "../services/qr.service.js";
import { writeAuditLog } from "../services/audit.service.js";

// Helper to auto-issue a degree record when verification and payment succeeds
export async function autoIssueDegree(request, req) {
  // Populate student if not already populated
  if (request.populate && (!request.student || !request.student.email)) {
    await request.populate("student");
  }

  let issuer = await User.findOne({ university: request.university._id || request.university, role: roles.UNIVERSITY_ADMIN });
  if (!issuer) {
    issuer = await User.findOne({ role: roles.SUPER_ADMIN });
  }
  const issuerId = issuer ? issuer._id : (req && req.user ? req.user._id : request.student._id || request.student);

  let degree = await Degree.findOne({ degreeHash: request.degreeHash });
  if (!degree) {
    degree = await Degree.create({
      studentName: request.student?.name || (req && req.user ? req.user.name : "Student"),
      studentEmail: request.student?.email || (req && req.user ? req.user.email : "student@iqra.edu"),
      studentWallet: request.studentWallet,
      degreeTitle: request.degreeTitle,
      department: request.department,
      graduationYear: request.graduationYear,
      issueDate: request.issueDate || new Date(),
      university: request.university._id || request.university,
      issuedBy: issuerId,
      ipfsCID: request.ipfsCID,
      degreeHash: request.degreeHash,
      blockchainTxHash: request.paymentTxHash || "auto_" + Math.random().toString(36).substring(2, 12),
      contractAddress: "0x0000000000000000000000000000000000000000",
      chainId: 0
    });
    degree.qrCodeDataUrl = await createDegreeQrCode(degree._id);
    await degree.save();
  }

  request.status = "ISSUED";
  await request.save();

  if (req) {
    await writeAuditLog({
      req,
      action: "DEGREE_REQUEST_AUTO_APPROVED_AND_MINTED",
      targetType: "DegreeRequest",
      targetId: request._id.toString(),
      metadata: { degreeHash: request.degreeHash },
    });
  }
}


// Helper to check if YOLO found both stamp and signature
function evaluateYoloDetections(detections) {
  const hasSeal = detections.some(d => d.label === "university_seal" && d.confidence >= 0.8);
  const hasSignature = detections.some(d => d.label === "registrar_signature" && d.confidence >= 0.8);
  return hasSeal && hasSignature;
}

export const createDegreeRequest = asyncHandler(async (req, res) => {
  const files = req.files || {};
  const docFile = files.document?.[0] || files.transcript?.[0];
  if (!docFile) {
    throw new ApiError(400, "Main document (Degree or Transcript) image file is required");
  }

  const {
    universityId,
    degreeTitle,
    department,
    graduationYear,
    studentWallet,
    rollNumber,
    metricPercentage,
    interPercentage,
    cgpa,
    nicExpiryDate,
    paymentMethod,
    bitcoinTxHash,
    
    fatherName,
    dob,
    gender,
    maritalStatus,
    address,
    attestDegree,
    attestTranscript,
    qualifications
  } = req.body;

  if (!universityId || !degreeTitle || !department || !graduationYear || !studentWallet) {
    throw new ApiError(400, "All primary fields are required");
  }

  const isAttestDegree = attestDegree === "true" || attestDegree === true;
  const isAttestTranscript = attestTranscript === "true" || attestTranscript === true;
  let attDocCount = 0;
  if (isAttestDegree) attDocCount++;
  if (isAttestTranscript) attDocCount++;
  const calculatedFee = attDocCount * 3000;
  const consumerNumber = "1000" + Math.floor(10000000 + Math.random() * 90000000);

  let parsedQualifications = [];
  if (qualifications) {
    try {
      parsedQualifications = typeof qualifications === "string" ? JSON.parse(qualifications) : qualifications;
    } catch (e) {
      console.error("Failed to parse qualifications:", e);
    }
  }

  // Validate percentages, CGPA, and NIC expiry only if values are provided and positive
  if (metricPercentage && Number(metricPercentage) > 0 && Number(metricPercentage) < 50) {
    throw new ApiError(400, "Metric percentage must be 50% or higher");
  }
  if (interPercentage && Number(interPercentage) > 0 && Number(interPercentage) < 50) {
    throw new ApiError(400, "Intermediate percentage must be 50% or higher");
  }
  if (cgpa && Number(cgpa) > 0 && Number(cgpa) < 2.5) {
    throw new ApiError(400, "CGPA must be 2.5 or higher");
  }
  if (nicExpiryDate) {
    const expiry = new Date(nicExpiryDate);
    if (isNaN(expiry.getTime()) || expiry <= new Date()) {
      throw new ApiError(400, "NIC expiry date must be in the future");
    }
  }

  const university = await University.findById(universityId);
  if (!university || !university.active) {
    throw new ApiError(404, "Active university not found");
  }

  const documentUrl = `/uploads/${docFile.filename}`;
  const metricMarksheetUrl = files.metricMarksheet?.[0] ? `/uploads/${files.metricMarksheet[0].filename}` : "";
  const interMarksheetUrl = files.interMarksheet?.[0] ? `/uploads/${files.interMarksheet[0].filename}` : "";
  const transcriptUrl = files.transcript?.[0] ? `/uploads/${files.transcript[0].filename}` : "";
  const nicFrontUrl = files.nicFront?.[0] ? `/uploads/${files.nicFront[0].filename}` : "";
  const nicBackUrl = files.nicBack?.[0] ? `/uploads/${files.nicBack[0].filename}` : "";
  const paymentSlipUrl = files.paymentSlip?.[0] ? `/uploads/${files.paymentSlip[0].filename}` : "";

  // Run YOLO check on the uploaded main document file path
  const yoloResult = await analyzeDocument(docFile.path);
  const isAutoVerified = evaluateYoloDetections(yoloResult.detections);
  const yoloStatus = isAutoVerified ? "VERIFIED" : "FAILED";

  // Run OCR Check on other uploaded files
  const filePaths = {
    metricMarksheet: files.metricMarksheet?.[0]?.path,
    interMarksheet: files.interMarksheet?.[0]?.path,
    transcript: files.transcript?.[0]?.path,
    nicFront: files.nicFront?.[0]?.path,
    nicBack: files.nicBack?.[0]?.path,
  };
  const ocrReport = await validateRequestDocuments(filePaths);
  const ocrStatus = ocrReport.passed ? "PASSED" : "FAILED";

  // Determine request status based on YOLO + OCR
  // NOTE: Don't auto-reject on OCR/YOLO failure — admin reviews all requests
  // Auto-approve only if BOTH YOLO and OCR pass AND payment is complete
  const approved = isAutoVerified && ocrReport.passed;
  let status = "PENDING_VERIFICATION"; // Always start with pending — admin will review
  let paymentStatus = "PENDING";
  let finalBitcoinTxHash = "";
  
  if (paymentMethod === "BITCOIN" && bitcoinTxHash) {
    paymentStatus = "PAID";
    status = approved ? "PAID" : "PENDING_VERIFICATION";
    finalBitcoinTxHash = bitcoinTxHash.toLowerCase();
  } else if (paymentMethod === "ONELINK" && paymentSlipUrl) {
    paymentStatus = "PAID";
    status = approved ? "PAID" : "PENDING_VERIFICATION";
  }

  // Pre-generate issueDate and IPFS CID to calculate the deterministic hash
  const issueDate = new Date();
  
  // Format matching what is expected by canonicalizeDegreePayload
  const payloadForCidAndHash = {
    studentName: req.user.name,
    studentEmail: req.user.email,
    studentWallet: studentWallet.toLowerCase(),
    degreeTitle,
    department,
    graduationYear: Number(graduationYear),
    universityId: university._id.toString(),
    issueDate: issueDate.toISOString(),
  };

  const ipfsCID = await createDegreeMetadataCID(payloadForCidAndHash);
  const degreeHash = createDegreeHash({
    ...payloadForCidAndHash,
    ipfsCID,
  });

  const degreeRequest = await DegreeRequest.create({
    student: req.user._id,
    university: university._id,
    studentWallet: studentWallet.toLowerCase(),
    degreeTitle,
    department,
    graduationYear: Number(graduationYear),
    documentUrl,
    rollNumber: rollNumber || "",
    issueDate: issueDate,
    
    // Personal Details
    fatherName: fatherName || "",
    dob: dob || "",
    gender: gender || "",
    maritalStatus: maritalStatus || "",
    address: address || "",
    cnicName: ocrReport.cnicName || "",
    
    // Educational History
    qualifications: parsedQualifications,
    
    // Attestation selection & Payments
    attestDegree: isAttestDegree,
    attestTranscript: isAttestTranscript,
    calculatedFee,
    consumerNumber,
    rejectionReason: ocrReport.reason || "",

    metricPercentage: Number(metricPercentage) || 0,
    interPercentage: Number(interPercentage) || 0,
    cgpa: Number(cgpa) || 0,
    nicExpiryDate: nicExpiryDate ? new Date(nicExpiryDate) : null,
    paymentMethod: paymentMethod || "METAMASK",
    paymentSlipUrl,
    bitcoinTxHash: finalBitcoinTxHash,
    metricMarksheetUrl,
    interMarksheetUrl,
    transcriptUrl,
    nicFrontUrl,
    nicBackUrl,
    yoloStatus,
    yoloDetections: yoloResult.detections,
    ocrStatus,
    ocrDetails: {
      extractedMetricPercentage: ocrReport.metricPercentage,
      extractedInterPercentage: ocrReport.interPercentage,
      extractedCgpa: ocrReport.cgpa,
      extractedNicExpiry: ocrReport.nicExpiryDate,
      extractedNicNumber: ocrReport.nicNumber,
      failureReason: ocrReport.reason,
    },
    paymentStatus,
    status,
    degreeHash,
    ipfsCID,
  });

  await writeAuditLog({
    req,
    action: "DEGREE_REQUEST_CREATED",
    targetType: "DegreeRequest",
    targetId: degreeRequest._id.toString(),
    metadata: { degreeHash, status, yoloStatus, ocrStatus, paymentMethod },
  });

  if (degreeRequest.status === "PAID" && degreeRequest.yoloStatus === "VERIFIED" && degreeRequest.ocrStatus === "PASSED") {
    const populatedRequest = await DegreeRequest.findById(degreeRequest._id).populate("student");
    await autoIssueDegree(populatedRequest, req);
    degreeRequest.status = "ISSUED";
  }

  res.status(201).json({ degreeRequest });
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await DegreeRequest.find({ student: req.user._id })
    .populate("university", "name code")
    .sort({ createdAt: -1 });

  res.json({ requests });
});

export const getPendingRequests = asyncHandler(async (req, res) => {
  const query = {};

  // If university admin/staff, limit to their university
  if ([roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF].includes(req.user.role)) {
    query.university = req.user.university;
  }

  const requests = await DegreeRequest.find(query)
    .populate("student", "name email")
    .populate("university", "name code")
    .sort({ createdAt: -1 });

  res.json({ requests });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentTxHash, paymentMethod, bitcoinTxHash } = req.body;

  const request = await DegreeRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, "Degree request not found");
  }

  if (request.student.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only pay for your own requests");
  }

  if (paymentMethod) {
    request.paymentMethod = paymentMethod;
  }

  if (paymentMethod === "BITCOIN" && bitcoinTxHash) {
    request.bitcoinTxHash = bitcoinTxHash.toLowerCase();
    request.paymentStatus = "PAID";
    request.status = "PAID";
  } else if (paymentTxHash) {
    request.paymentTxHash = paymentTxHash.toLowerCase();
    request.paymentStatus = "PAID";
    request.status = "PAID";
  }

  await request.save();

  if (request.status === "PAID" && request.yoloStatus === "VERIFIED" && request.ocrStatus === "PASSED") {
    const populatedRequest = await DegreeRequest.findById(request._id).populate("student");
    await autoIssueDegree(populatedRequest, req);
    request.status = "ISSUED";
  }

  await writeAuditLog({
    req,
    action: "DEGREE_REQUEST_PAID",
    targetType: "DegreeRequest",
    targetId: request._id.toString(),
    metadata: { paymentTxHash, bitcoinTxHash, paymentMethod, degreeHash: request.degreeHash },
  });

  res.json({ request });
});

export const approveAndMintRequest = asyncHandler(async (req, res) => {
  let { blockchainTxHash, contractAddress, chainId } = req.body;
  
  if (!blockchainTxHash) {
    blockchainTxHash = "offchain_" + Math.random().toString(36).substring(2, 15);
  }
  if (!contractAddress) {
    contractAddress = "0x0000000000000000000000000000000000000000";
  }

  const request = await DegreeRequest.findById(req.params.id).populate("student").populate("university");
  if (!request) {
    throw new ApiError(404, "Degree request not found");
  }

  if (
    req.user.role !== roles.SUPER_ADMIN &&
    req.user.university?.toString() !== request.university._id.toString()
  ) {
    throw new ApiError(403, "You can only approve requests for your own university");
  }

  if (request.status === "ISSUED") {
    throw new ApiError(400, "Degree request has already been approved and issued");
  }

  // Create the final Degree record
  const degree = await Degree.create({
    studentName: request.student.name,
    studentEmail: request.student.email,
    studentWallet: request.studentWallet,
    degreeTitle: request.degreeTitle,
    department: request.department,
    graduationYear: request.graduationYear,
    issueDate: new Date(),
    university: request.university._id,
    issuedBy: req.user._id,
    ipfsCID: request.ipfsCID,
    degreeHash: request.degreeHash,
    blockchainTxHash: blockchainTxHash.toLowerCase(),
    contractAddress: contractAddress.toLowerCase(),
    chainId,
  });

  degree.qrCodeDataUrl = await createDegreeQrCode(degree._id);
  await degree.save();

  // Mark request as ISSUED
  request.status = "ISSUED";
  await request.save();

  await writeAuditLog({
    req,
    action: "DEGREE_REQUEST_APPROVED_AND_MINTED",
    targetType: "DegreeRequest",
    targetId: request._id.toString(),
    metadata: { degreeHash: request.degreeHash, blockchainTxHash },
  });

  res.json({ request, degree });
});

export const ocrPreview = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded for OCR scanning.");
  }

  const { type } = req.body; // 'metric', 'inter', 'transcript', 'nic'
  const filePath = req.file.path;

  let value = null;
  let text = "";

  try {
    text = await performOcr(filePath);

    if (type === "metric" || type === "inter") {
      value = extractPercentage(text);
    } else if (type === "transcript") {
      value = extractCgpa(text);
    } else if (type === "nic") {
      const expiry = extractNicExpiry(text);
      value = expiry ? expiry.toISOString().split("T")[0] : null;
    }
  } catch (error) {
    console.error("OCR preview processing failed:", error);
  } finally {
    // Clean up temporary upload file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Failed to delete temp file:", err);
    }
  }

  res.json({
    success: true,
    value,
    textSnippet: text ? text.substring(0, 300) : ""
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const request = await DegreeRequest.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, "Degree request not found");
  }

  request.status = "REJECTED";
  request.rejectionReason = reason;
  await request.save();

  await writeAuditLog({
    req,
    action: "DEGREE_REQUEST_REJECTED",
    targetType: "DegreeRequest",
    targetId: request._id.toString(),
    metadata: { reason, degreeHash: request.degreeHash },
  });

  res.json({ success: true, request });
});

export const updateDegreeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await DegreeRequest.findById(id).populate("student").populate("university");
  if (!request) {
    throw new ApiError(404, "Degree request not found");
  }

  // Update request fields from body
  const editableFields = [
    "degreeTitle", "department", "graduationYear", "rollNumber",
    "fatherName", "dob", "gender", "maritalStatus", "address",
    "metricPercentage", "interPercentage", "cgpa",
    "ocrStatus", "yoloStatus", "status", "rejectionReason"
  ];

  editableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      request[field] = req.body[field];
    }
  });

  // If status is updated to ISSUED by the admin via edit, make sure a Degree record gets created
  if (req.body.status === "ISSUED" && request.status !== "ISSUED") {
    let issuer = await User.findOne({ university: request.university._id, role: roles.UNIVERSITY_ADMIN });
    if (!issuer) {
      issuer = await User.findOne({ role: roles.SUPER_ADMIN });
    }
    const issuerId = issuer ? issuer._id : req.user._id;

    let degree = await Degree.findOne({ degreeHash: request.degreeHash });
    if (!degree) {
      degree = await Degree.create({
        studentName: request.student?.name || "Student",
        studentEmail: request.student?.email || "student@iqra.edu",
        studentWallet: request.studentWallet,
        degreeTitle: request.degreeTitle,
        department: request.department,
        graduationYear: request.graduationYear,
        issueDate: new Date(),
        university: request.university._id,
        issuedBy: issuerId,
        ipfsCID: request.ipfsCID,
        degreeHash: request.degreeHash,
        blockchainTxHash: request.paymentTxHash || "admin_manual_" + Math.random().toString(36).substring(2, 12),
        contractAddress: "0x0000000000000000000000000000000000000000",
        chainId: 0
      });
      degree.qrCodeDataUrl = await createDegreeQrCode(degree._id);
      await degree.save();
    }
  }

  await request.save();

  // If status is set to PAID and it is verified, auto issue
  if (request.status === "PAID" && request.yoloStatus === "VERIFIED" && request.ocrStatus === "PASSED") {
    const populatedRequest = await DegreeRequest.findById(request._id).populate("student");
    await autoIssueDegree(populatedRequest, req);
  }

  await writeAuditLog({
    req,
    action: "DEGREE_REQUEST_UPDATED",
    targetType: "DegreeRequest",
    targetId: request._id.toString(),
    metadata: { fieldsUpdated: Object.keys(req.body) },
  });

  res.json({ success: true, request });
});
