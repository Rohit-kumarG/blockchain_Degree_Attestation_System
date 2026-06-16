import { createWorker } from "tesseract.js";

/**
 * Extract NIC expiry date from a CNIC image using multiple OCR passes
 * @param {File} imageFile
 * @returns {Promise<string|null>} ISO date string "YYYY-MM-DD" or null
 */
export async function extractNicExpiryFromImage(imageFile) {
  const blobs = await createMultiplePreprocessedVersions(imageFile);

  const worker = await createWorker("eng");

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: "6",
      tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./-:, ",
    });

    const allTexts = [];

    for (const blob of blobs) {
      const url = URL.createObjectURL(blob);
      try {
        const { data: { text } } = await worker.recognize(url);
        if (text && text.trim().length > 10) {
          allTexts.push(text);
        }
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    const combinedText = allTexts.join("\n");
    console.log("[NIC OCR] Combined OCR text:", combinedText);

    const result = parseExpiryDate(combinedText);
    console.log("[NIC OCR] Expiry date extracted:", result);
    return result;
  } finally {
    await worker.terminate();
  }
}

/**
 * Create multiple preprocessed versions with different contrast levels
 */
async function createMultiplePreprocessedVersions(file) {
  const filters = [
    "grayscale(100%) contrast(250%) brightness(110%)",
    "grayscale(100%) contrast(400%) brightness(100%)",
    "grayscale(100%) contrast(180%) brightness(125%)",
  ];
  return Promise.all(filters.map((filter) => processImage(file, filter)));
}

function processImage(file, filter) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.max(1, 2000 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob || file), "image/png");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Parse expiry date from OCR text using multiple strategies
 */
function parseExpiryDate(combinedText) {
  const allDates = new Set();

  // Strategy 1: Standard date patterns (DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD)
  const strictPatterns = [
    /\b(\d{1,2})[./\-](\d{1,2})[./\-](\d{4})\b/g,
    /\b(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})\b/g,
    /\b(\d{1,2})[./\-](\d{1,2})[./\-](\d{2})\b/g,
  ];
  for (const pattern of strictPatterns) {
    let m;
    while ((m = pattern.exec(combinedText)) !== null) {
      const d = tryParseDate(m[1], m[2], m[3]);
      if (d) allDates.add(d);
    }
  }

  // Strategy 2: Flexible separators including spaces
  const flexPattern = /\b(\d{1,2})\s*[./,\-]\s*(\d{1,2})\s*[./,\-]\s*(\d{2,4})\b/g;
  let fm;
  while ((fm = flexPattern.exec(combinedText)) !== null) {
    const d = tryParseDate(fm[1], fm[2], fm[3]);
    if (d) allDates.add(d);
  }

  // Strategy 3: Find future year (20XX) and look for nearby day/month numbers
  const yearPattern = /\b(20[2-9]\d)\b/g;
  let ym;
  while ((ym = yearPattern.exec(combinedText)) !== null) {
    const year = ym[1];
    const before = combinedText.substring(Math.max(0, ym.index - 20), ym.index);
    const nearbyNums = before.match(/(\d{1,2})\D+(\d{1,2})\D*$/);
    if (nearbyNums) {
      const d = tryParseDate(nearbyNums[1], nearbyNums[2], year);
      if (d) allDates.add(d);
    }
  }

  // Strategy 4: Lines mentioning expiry-related keywords
  const lines = combinedText.split("\n");
  for (const line of lines) {
    if (/expir|expry|exp|valid|orly|iry|ory|date/i.test(line)) {
      const nums = line.match(/\d+/g);
      if (nums && nums.length >= 3) {
        for (let i = 0; i <= nums.length - 3; i++) {
          const d = tryParseDate(nums[i], nums[i + 1], nums[i + 2]);
          if (d) allDates.add(d);
        }
      }
    }
  }

  // Strategy 5: All consecutive number triplets anywhere in text
  const allNums = combinedText.match(/\d+/g) || [];
  for (let i = 0; i <= allNums.length - 3; i++) {
    const d = tryParseDate(allNums[i], allNums[i + 1], allNums[i + 2]);
    if (d) allDates.add(d);
  }

  const dates = Array.from(allDates).sort();

  if (dates.length === 0) return null;

  const now = new Date();
  const futureDates = dates.filter((d) => new Date(d) > now);

  if (futureDates.length > 0) return futureDates[0]; // nearest future date = expiry

  return dates[dates.length - 1]; // latest date as fallback
}

function tryParseDate(p1, p2, p3) {
  p1 = String(p1).replace(/[oOlI]/g, (c) => (c === "l" || c === "I" ? "1" : "0"));
  p2 = String(p2).replace(/[oOlI]/g, (c) => (c === "l" || c === "I" ? "1" : "0"));
  p3 = String(p3).replace(/[oOlI]/g, (c) => (c === "l" || c === "I" ? "1" : "0"));

  let year, month, day;

  if (p1.length === 4) {
    year = parseInt(p1); month = parseInt(p2); day = parseInt(p3);
  } else if (p3.length === 4 || p3.length === 2) {
    day = parseInt(p1); month = parseInt(p2); year = parseInt(p3);
    if (year < 100) year += 2000;
  } else {
    return null;
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 2000 || year > 2099) return null;

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}
