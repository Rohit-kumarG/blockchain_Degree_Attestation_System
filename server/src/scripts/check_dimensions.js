import fs from "fs";

function getJpgSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 4;
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i);
    i += 2;
    if (marker === 0xFFC0 || marker === 0xFFC2) {
      const height = buffer.readUInt16BE(i + 3);
      const width = buffer.readUInt16BE(i + 5);
      return { width, height };
    } else {
      const length = buffer.readUInt16BE(i);
      i += length;
    }
  }
  return null;
}

const size = getJpgSize("c:/Users/hp/Desktop/Degree-Attestation-System/server/uploads/nicFront-1781463443143-786290759.jpg");
console.log("Image Dimensions:", size);
