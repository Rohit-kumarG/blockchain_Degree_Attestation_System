import QRCode from "qrcode";
import { env } from "../config/env.js";

export async function createDegreeQrCode(degreeId) {
  const verificationUrl = `${env.apiBaseUrl}/api/verification/degrees/${degreeId}`;
  return QRCode.toDataURL(verificationUrl);
}

