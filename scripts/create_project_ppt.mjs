import pptxgen from "pptxgenjs";
import path from "node:path";
import fs from "node:fs";

const projectDir = "C:/Users/hp/Desktop/Degree-Attestation-System";
const outDir = "C:/Users/hp/Documents/Codex/2026-05-12/files-mentioned-by-the-user-blockchain";
const outFile = path.join(outDir, "Degree-Attestation-System-Presentation.pptx");
const logo = path.join(projectDir, "logoiqra.png");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Degree Attestation System";
pptx.company = "Iqra University";
pptx.subject = "Blockchain Based Degree Attestation System";
pptx.title = "Advanced Blockchain Based Degree Attestation System";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const colors = {
  green: "047857",
  dark: "10241C",
  navy: "0F172A",
  stone: "57534E",
  pale: "EEF7F1",
  sky: "0369A1",
  red: "B91C1C",
  amber: "B45309",
  white: "FFFFFF",
};

function addFooter(slide, n) {
  slide.addText("Advanced Blockchain Based Degree Attestation System", {
    x: 0.45,
    y: 7.15,
    w: 8.5,
    h: 0.2,
    fontSize: 8,
    color: "6B7280",
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.35,
    y: 7.08,
    w: 0.4,
    h: 0.25,
    fontSize: 9,
    bold: true,
    color: colors.green,
    align: "right",
  });
}

function title(slide, text, sub) {
  slide.addText(text, {
    x: 0.55,
    y: 0.38,
    w: 8.7,
    h: 0.45,
    fontSize: 24,
    bold: true,
    color: colors.navy,
    margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: 0.58,
      y: 0.86,
      w: 8.7,
      h: 0.25,
      fontSize: 9.5,
      color: colors.stone,
      margin: 0,
    });
  }
  slide.addShape(pptx.ShapeType.line, {
    x: 0.55,
    y: 1.22,
    w: 12.2,
    h: 0,
    line: { color: "D6D3D1", width: 1 },
  });
}

function bulletBox(slide, heading, bullets, x, y, w, h, accent = colors.green) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: colors.white },
    line: { color: "D6D3D1", width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.09,
    h,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(heading, {
    x: x + 0.25,
    y: y + 0.22,
    w: w - 0.4,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: colors.navy,
    margin: 0,
  });
  slide.addText(bullets.map((b) => ({ text: b, options: { bullet: { indent: 12 } } })), {
    x: x + 0.28,
    y: y + 0.68,
    w: w - 0.45,
    h: h - 0.85,
    fontSize: 10.5,
    color: colors.stone,
    breakLine: false,
    fit: "shrink",
  });
}

function pill(slide, text, x, y, w, color = colors.green) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.36,
    rectRadius: 0.05,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x,
    y: y + 0.09,
    w,
    h: 0.14,
    fontSize: 8.5,
    bold: true,
    color: colors.white,
    align: "center",
    margin: 0,
  });
}

function addLogo(slide) {
  if (fs.existsSync(logo)) {
    slide.addImage({ path: logo, x: 11.7, y: 0.35, w: 0.8, h: 0.8 });
  }
}

let s = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: colors.dark };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: colors.dark } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.75, w: 13.33, h: 1.75, fill: { color: "0B3B2B", transparency: 10 } });
  if (fs.existsSync(logo)) slide.addImage({ path: logo, x: 0.7, y: 0.55, w: 1.0, h: 1.0 });
  slide.addText("Advanced Blockchain Based", { x: 0.78, y: 1.75, w: 7.5, h: 0.4, fontSize: 18, color: "A7F3D0", bold: true });
  slide.addText("Degree Attestation System", { x: 0.75, y: 2.25, w: 9.3, h: 0.75, fontSize: 36, color: colors.white, bold: true });
  slide.addText("Ethereum Private Blockchain | Smart Contracts | MongoDB | IPFS | React | Node.js", {
    x: 0.8,
    y: 3.2,
    w: 9.5,
    h: 0.35,
    fontSize: 13,
    color: "D1FAE5",
  });
  pill(slide, "Fraud Detection", 0.8, 4.05, 1.5);
  pill(slide, "QR Verification", 2.45, 4.05, 1.55, colors.sky);
  pill(slide, "Role Based Access", 4.15, 4.05, 1.8, colors.amber);
  slide.addText("Final Year / Course Project Presentation", { x: 0.8, y: 6.55, w: 5.5, h: 0.3, fontSize: 12, color: "D1FAE5" });
}

{
  const slide = pptx.addSlide();
  title(slide, "Problem Statement", "Traditional degree verification is slow, manual, and vulnerable to fraud.");
  addLogo(slide);
  bulletBox(slide, "Current Problems", [
    "Fake degrees can be created or modified easily.",
    "Employers depend on manual university confirmation.",
    "Verification takes time and lacks transparent audit history.",
    "Centralized records can be changed by insiders or attackers.",
  ], 0.65, 1.65, 5.8, 4.75, colors.red);
  bulletBox(slide, "Project Need", [
    "A tamper-evident verification method.",
    "A trusted multi-university attestation platform.",
    "A fast QR-based employer verification portal.",
    "A system that combines usability with blockchain proof.",
  ], 6.9, 1.65, 5.8, 4.75, colors.green);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Project Objectives", "The goal is to build a secure, verifiable, and role-based digital degree attestation platform.");
  addLogo(slide);
  const items = [
    ["Issue degrees", "Approved universities issue degree records and generate hashes."],
    ["Verify degrees", "Employers verify credentials using degree ID or QR code."],
    ["Detect fraud", "Changed data creates a different hash and fails verification."],
    ["Audit activity", "Important actions are logged for accountability."],
    ["Support roles", "Admin, university, student, employer, and auditor workflows."],
    ["Use Web3", "Smart contracts, MetaMask, private Ethereum, and IPFS integration."],
  ];
  items.forEach((item, i) => {
    const x = 0.65 + (i % 3) * 4.15;
    const y = 1.55 + Math.floor(i / 3) * 2.2;
    bulletBox(slide, item[0], [item[1]], x, y, 3.65, 1.55, i % 2 ? colors.sky : colors.green);
  });
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Proposed Solution", "A hybrid Web3 architecture where blockchain stores proof, not the entire application database.");
  addLogo(slide);
  const layers = [
    ["React Frontend", "Dashboards, portals, MetaMask, QR verification"],
    ["Node.js Backend", "Business logic, auth, hashing, APIs, audit logs"],
    ["MongoDB", "Users, universities, degree records, analytics"],
    ["IPFS", "Degree metadata and document references"],
    ["Ethereum Smart Contract", "Immutable degree hash proof and revocation status"],
  ];
  layers.forEach((layer, i) => {
    const y = 1.35 + i * 1.02;
    slide.addShape(pptx.ShapeType.roundRect, { x: 1.0, y, w: 11.2, h: 0.72, rectRadius: 0.04, fill: { color: i === 4 ? colors.dark : colors.white }, line: { color: "D6D3D1" } });
    slide.addText(layer[0], { x: 1.25, y: y + 0.16, w: 2.9, h: 0.24, fontSize: 13, bold: true, color: i === 4 ? colors.white : colors.navy, margin: 0 });
    slide.addText(layer[1], { x: 4.25, y: y + 0.17, w: 7.6, h: 0.22, fontSize: 10.5, color: i === 4 ? "D1FAE5" : colors.stone, margin: 0 });
  });
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "System Architecture", "Frontend, backend, database, IPFS, and blockchain communicate through controlled workflows.");
  addLogo(slide);
  const boxes = [
    ["React Frontend", 0.8, 1.5, colors.sky],
    ["Express Backend", 4.8, 1.5, colors.green],
    ["MongoDB", 8.7, 1.0, colors.amber],
    ["IPFS", 8.7, 2.35, colors.sky],
    ["Ethereum Contract", 4.8, 4.0, colors.dark],
    ["Private Blockchain", 8.7, 4.0, colors.green],
  ];
  boxes.forEach(([text, x, y, color]) => {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.1, h: 0.78, rectRadius: 0.05, fill: { color }, line: { color } });
    slide.addText(text, { x, y: y + 0.25, w: 3.1, h: 0.18, align: "center", fontSize: 12, bold: true, color: colors.white, margin: 0 });
  });
  [["3.9", "1.9", "4.8", "1.9"], ["7.9", "1.65", "8.7", "1.38"], ["7.9", "1.95", "8.7", "2.72"], ["6.35", "2.3", "6.35", "4.0"], ["7.9", "4.38", "8.7", "4.38"]].forEach(([x1, y1, x2, y2]) => {
    slide.addShape(pptx.ShapeType.line, { x: Number(x1), y: Number(y1), w: Number(x2) - Number(x1), h: Number(y2) - Number(y1), line: { color: colors.green, width: 2, beginArrowType: "none", endArrowType: "triangle" } });
  });
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "User Roles", "Each role sees different features according to its responsibility.");
  addLogo(slide);
  bulletBox(slide, "Admin", ["Create universities", "Issue and revoke degrees", "View dashboard and audit logs"], 0.7, 1.45, 3.9, 2.1, colors.green);
  bulletBox(slide, "Student", ["View own issued degrees", "Share degree ID or QR", "Verify degree status"], 4.75, 1.45, 3.9, 2.1, colors.sky);
  bulletBox(slide, "Employer", ["Open verification portal", "Paste degree ID", "Check valid, revoked, tampered, or not found"], 8.8, 1.45, 3.9, 2.1, colors.amber);
  bulletBox(slide, "Auditor", ["Read audit logs", "Inspect suspicious events", "Monitor platform accountability"], 2.7, 4.15, 3.9, 2.1, colors.red);
  bulletBox(slide, "University Staff", ["Issue degrees for own university", "Verify submitted records", "Cannot manage full platform"], 6.75, 4.15, 3.9, 2.1, colors.dark);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Degree Issuance Workflow", "How a trusted degree record is created.");
  addLogo(slide);
  const steps = ["Login", "Enter degree data", "Upload/store metadata", "Generate hash", "Issue on blockchain", "Generate QR"];
  steps.forEach((step, i) => {
    const x = 0.65 + i * 2.05;
    slide.addShape(pptx.ShapeType.ellipse, { x, y: 2.35, w: 1.2, h: 1.2, fill: { color: i % 2 ? colors.sky : colors.green }, line: { color: "FFFFFF" } });
    slide.addText(String(i + 1), { x, y: 2.72, w: 1.2, h: 0.2, fontSize: 18, bold: true, color: colors.white, align: "center", margin: 0 });
    slide.addText(step, { x: x - 0.2, y: 3.75, w: 1.6, h: 0.35, fontSize: 10.5, bold: true, color: colors.navy, align: "center" });
    if (i < steps.length - 1) slide.addShape(pptx.ShapeType.line, { x: x + 1.2, y: 2.95, w: 0.85, h: 0, line: { color: "9CA3AF", width: 2, endArrowType: "triangle" } });
  });
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Degree Verification Workflow", "How employers detect real or fake degrees.");
  addLogo(slide);
  bulletBox(slide, "Verification Steps", [
    "Employer scans QR code or enters degree ID.",
    "Backend fetches degree record from MongoDB.",
    "System recomputes the canonical degree hash.",
    "Blockchain proof and revocation status are checked.",
    "Result is shown as valid, revoked, tampered, or not found.",
  ], 0.8, 1.55, 5.8, 4.9, colors.green);
  bulletBox(slide, "Fake Degree Detection", [
    "If a name, degree, year, university, or IPFS CID changes, the hash changes.",
    "A changed hash does not match blockchain proof.",
    "This makes fraud visible during verification.",
  ], 7.0, 1.55, 5.3, 4.9, colors.red);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Smart Contract Design", "Solidity contract acts as the public trust rulebook.");
  addLogo(slide);
  bulletBox(slide, "Core Functions", ["approveUniversity()", "issueDegree()", "verifyDegree()", "revokeDegree()"], 0.8, 1.5, 4.0, 4.85, colors.green);
  bulletBox(slide, "Stored Proof", ["degreeHash", "studentWallet", "universityWallet", "ipfsCID", "issuedAt", "revoked status"], 4.95, 1.5, 3.8, 4.85, colors.sky);
  bulletBox(slide, "Security Rules", ["Only approved universities issue degrees.", "Only authorized parties revoke degrees.", "Issued hashes cannot be duplicated.", "Revoked degrees remain auditable."], 8.9, 1.5, 3.55, 4.85, colors.red);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Frontend Features", "React dashboard provides a role-based user experience.");
  addLogo(slide);
  bulletBox(slide, "Admin Dashboard", ["Analytics cards", "Graphs and verification breakdown", "University and degree management"], 0.75, 1.45, 3.8, 4.8, colors.green);
  bulletBox(slide, "Student Portal", ["View own degrees", "Copy degree ID", "Share QR/verification link"], 4.8, 1.45, 3.8, 4.8, colors.sky);
  bulletBox(slide, "Employer Portal", ["Verify degree ID", "See validity status", "Detect tampered or revoked degrees"], 8.85, 1.45, 3.8, 4.8, colors.amber);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Backend Features", "Express API coordinates authentication, database, IPFS, and blockchain services.");
  addLogo(slide);
  bulletBox(slide, "Authentication", ["JWT sessions", "bcrypt password hashing", "Role-based middleware"], 0.8, 1.5, 3.7, 4.75, colors.green);
  bulletBox(slide, "Business APIs", ["University management", "Degree issuance", "Degree verification", "Revocation"], 4.8, 1.5, 3.7, 4.75, colors.sky);
  bulletBox(slide, "System Services", ["Hash generation", "IPFS metadata upload", "Blockchain read adapter", "Audit logging"], 8.8, 1.5, 3.7, 4.75, colors.amber);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Dashboard and Analytics", "The project includes visual analytics for demonstration and monitoring.");
  addLogo(slide);
  bulletBox(slide, "Dashboard Widgets", ["Universities count", "Degrees count", "Verification attempts", "Fraud flags", "Trust score"], 0.8, 1.45, 4.0, 4.9, colors.green);
  bulletBox(slide, "Graphs", ["Degree issuance trend", "Verification result distribution", "Credential coverage", "Recent verification activity"], 4.95, 1.45, 4.0, 4.9, colors.sky);
  bulletBox(slide, "Why It Matters", ["Helps admin monitor platform health.", "Shows suspicious activity quickly.", "Supports professor/demo explanation visually."], 9.1, 1.45, 3.4, 4.9, colors.red);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Security Considerations", "Security is applied at frontend, backend, database, and smart contract levels.");
  addLogo(slide);
  const security = [
    "Frontend hides unauthorized pages according to role.",
    "Backend enforces JWT and role middleware.",
    "Passwords are stored using bcrypt hashes.",
    "Smart contract checks wallet-based permissions.",
    "Degree verification does not trust MongoDB blindly.",
    "Audit logs create accountability for important actions.",
  ];
  bulletBox(slide, "Implemented Security", security, 1.2, 1.45, 10.9, 4.9, colors.green);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Testing and Demo Plan", "How to demonstrate the project to the professor.");
  addLogo(slide);
  bulletBox(slide, "Demo Accounts", ["Admin: admin@example.com", "Student: student@example.com", "Employer: employer@example.com", "Auditor: auditor@example.com", "Password: ChangeMe123!"], 0.8, 1.45, 5.2, 4.9, colors.sky);
  bulletBox(slide, "Demo Flow", ["Login as admin and show dashboard.", "Create/view university.", "Issue a degree.", "Login as student and view degree.", "Login as employer and verify degree.", "Show audit logs."], 6.35, 1.45, 5.9, 4.9, colors.green);
  addFooter(slide, s++);
}

{
  const slide = pptx.addSlide();
  title(slide, "Conclusion and Future Enhancements", "The system demonstrates a practical hybrid Web3 solution for academic credential trust.");
  addLogo(slide);
  bulletBox(slide, "Conclusion", [
    "The project reduces fake degree risk.",
    "Blockchain stores tamper-evident proof.",
    "MongoDB keeps the application fast and searchable.",
    "IPFS supports content-addressed metadata.",
    "Role-based portals support real-world users.",
  ], 0.8, 1.45, 5.7, 4.9, colors.green);
  bulletBox(slide, "Future Work", [
    "Formal smart contract audit.",
    "Encrypted degree documents.",
    "Cloud deployment and CI/CD.",
    "Multi-node private blockchain governance.",
    "Email verification and advanced reporting.",
  ], 6.8, 1.45, 5.55, 4.9, colors.amber);
  addFooter(slide, s++);
}

await pptx.writeFile({ fileName: outFile });
console.log(outFile);
