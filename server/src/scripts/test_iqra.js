import { performOcr, extractNicExpiry } from "../services/ocrService.js";
import path from "path";

async function test() {
  const files = [
    "c:/Users/hp/Desktop/Degree-Attestation-System/iqra1.jpeg",
    "c:/Users/hp/Desktop/Degree-Attestation-System/iqra2.png",
    "c:/Users/hp/Desktop/Degree-Attestation-System/iqra3.PNG"
  ];
  for (const f of files) {
    console.log(`=== OCR ON ${path.basename(f)} ===`);
    const text = await performOcr(f);
    console.log(text.substring(0, 300));
    console.log("Extracted Expiry Date:", extractNicExpiry(text));
  }
}
test();
