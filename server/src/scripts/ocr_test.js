import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';

const uploadsDir = 'c:/Users/hp/Desktop/Degree-Attestation-System/server/uploads';
const files = fs.readdirSync(uploadsDir).map(f => path.join(uploadsDir, f));

async function run() {
  for (const f of files) {
    console.log(`--- OCR on ${path.basename(f)} ---`);
    try {
      const { data: { text } } = await Tesseract.recognize(f, 'eng');
      console.log(text);
    } catch (e) {
      console.error(`Error on ${f}:`, e);
    }
  }
}

run();
