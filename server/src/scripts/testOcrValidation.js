import { extractPercentage, extractCgpa, extractNicExpiry, extractNicNumber, extractName, checkNamesMatch } from "../services/ocrService.js";

function runTests() {
  console.log("=== Running OCR Service Unit Tests ===");

  // Test 1: extractPercentage
  const text1 = "BOARD OF INTERMEDIATE & SECONDARY EDUCATION SUKKUR.\nTOTAL MARKS: 844 / 1100\nGRADE A";
  const pct1 = extractPercentage(text1);
  console.log("Test 1 (Obtained/Total Ratio):", pct1 === 76.73 ? "PASSED" : `FAILED (Got: ${pct1})`);

  const text2 = "Percentage obtained is 82.5% in final exams.";
  const pct2 = extractPercentage(text2);
  console.log("Test 2 (Explicit percentage):", pct2 === 82.5 ? "PASSED" : `FAILED (Got: ${pct2})`);

  // Test 2: extractCgpa
  const text3 = "OFFICIAL TRANSCRIPT\nCumulative GPA (CGPA): 3.45\nResult: PASS";
  const cgpa1 = extractCgpa(text3);
  console.log("Test 3 (Explicit CGPA):", cgpa1 === 3.45 ? "PASSED" : `FAILED (Got: ${cgpa1})`);

  const text4 = "Semester GPA: 3.12, CGPA is 2.89";
  const cgpa2 = extractCgpa(text4);
  console.log("Test 4 (Multiple GPAs):", cgpa2 === 2.89 ? "PASSED" : `FAILED (Got: ${cgpa2})`);

  // Test 3: extractNicExpiry
  const text5 = "NATIONAL IDENTITY CARD\nDate of Expiry: 12.10.2028\nStatus: Active";
  const exp1 = extractNicExpiry(text5);
  console.log("Test 5 (NIC Expiry Date):", exp1 instanceof Date && exp1.getFullYear() === 2028 ? "PASSED" : `FAILED (Got: ${exp1})`);

  // Test 4: extractNicNumber
  const text6 = "CNIC Number: 42201-1234567-3\nHolder: Student";
  const nic1 = extractNicNumber(text6);
  console.log("Test 6 (NIC Format):", nic1 === "42201-1234567-3" ? "PASSED" : `FAILED (Got: ${nic1})`);

  // Test 5: extractName
  const text7 = "NATIONAL IDENTITY CARD\nName: ROMIT KUMAR\nFather Name: GURMUKHDAS";
  const name1 = extractName(text7);
  console.log("Test 7 (Extract Name):", name1 === "ROMIT KUMAR" ? "PASSED" : `FAILED (Got: ${name1})`);

  // Test 6: checkNamesMatch
  const match1 = checkNamesMatch("ROMIT KUMAR", "ROMIT KUMAR HINDU");
  console.log("Test 8 (Name matching logic):", match1 === true ? "PASSED" : "FAILED");

  // Test 7: Marks in Words parsing
  const text8 = "MARKS IN WORDS: Eight Hundred and Forty Four";
  const pct8 = extractPercentage(text8);
  console.log("Test 9 (Sindh Board Words to %):", pct8 === 76.73 ? "PASSED" : `FAILED (Got: ${pct8})`);
}

runTests();
