import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createDegreeRequest,
  getMyRequests,
  getPendingRequests,
  confirmPayment,
  approveAndMintRequest,
  ocrPreview,
  rejectRequest,
  updateDegreeRequest,
} from "../controllers/degreeRequest.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { roles } from "../utils/roles.js";

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

export const degreeRequestRouter = Router();

degreeRequestRouter.post(
  "/",
  authenticate,
  authorize(roles.STUDENT),
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "metricMarksheet", maxCount: 1 },
    { name: "interMarksheet", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
    { name: "paymentSlip", maxCount: 1 }
  ]),
  createDegreeRequest
);

degreeRequestRouter.post(
  "/ocr-preview",
  authenticate,
  authorize(roles.STUDENT),
  upload.single("file"),
  ocrPreview
);

degreeRequestRouter.get(
  "/my-requests",
  authenticate,
  authorize(roles.STUDENT),
  getMyRequests
);

degreeRequestRouter.get(
  "/pending",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  getPendingRequests
);

degreeRequestRouter.patch(
  "/:id/pay",
  authenticate,
  authorize(roles.STUDENT),
  confirmPayment
);

degreeRequestRouter.post(
  "/:id/approve-mint",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  approveAndMintRequest
);

degreeRequestRouter.patch(
  "/:id/reject",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  rejectRequest
);

degreeRequestRouter.patch(
  "/:id",
  authenticate,
  authorize(roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF),
  updateDegreeRequest
);
