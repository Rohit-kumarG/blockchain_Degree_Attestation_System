import { performOcr, extractNicExpiry } from "../services/ocrService.js";
import path from "path";

async function test() {
  const filePath = "c:/Users/hp/Desktop/Degree-Attestation-System/server/uploads/nicFront-1781463443143-786290759.jpg";
  const text = await performOcr(filePath);
  console.log("=== EXTRACTED TEXT ===");
  console.log(text);
  console.log("======================");
  const expiry = extractNicExpiry(text);
  console.log("Extracted Expiry Date:", expiry);
}
test();
