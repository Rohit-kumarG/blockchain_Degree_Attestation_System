import { connectDatabase } from "../config/database.js";
import { Degree } from "../models/Degree.js";
import { University } from "../models/University.js";
import { User } from "../models/User.js";
import { hashPassword } from "../services/auth.service.js";
import { createDegreeMetadataCID } from "../services/ipfs.service.js";
import { createDegreeQrCode } from "../services/qr.service.js";
import { createDegreeHash } from "../utils/hashDegree.js";
import { roles } from "../utils/roles.js";

async function upsertUser({ name, email, password, role, walletAddress, university }) {
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.role = role;
    existing.walletAddress = walletAddress?.toLowerCase();
    existing.university = university;
    existing.active = true;
    await existing.save();
    return existing;
  }

  return User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role,
    walletAddress: walletAddress?.toLowerCase(),
    university,
    active: true,
  });
}

async function seedDemoData() {
  await connectDatabase();

  const password = "ChangeMe123!";
  let demoUniversity = await University.findOne({
    $or: [{ code: "DU" }, { walletAddress: "0x1111111111111111111111111111111111111111" }],
  });

  if (!demoUniversity) {
    demoUniversity = await University.create({
      name: "Demo University",
      code: "DU",
      walletAddress: "0x1111111111111111111111111111111111111111",
      active: true,
    });
  } else {
    demoUniversity.name = demoUniversity.name || "Demo University";
    demoUniversity.code = demoUniversity.code || "DU";
    demoUniversity.walletAddress = demoUniversity.walletAddress || "0x1111111111111111111111111111111111111111";
    demoUniversity.active = true;
    await demoUniversity.save();
  }

  const admin = await upsertUser({
    name: "Platform Admin",
    email: "admin@example.com",
    password,
    role: roles.SUPER_ADMIN,
  });

  await upsertUser({
    name: "University Admin",
    email: "university@example.com",
    password,
    role: roles.UNIVERSITY_ADMIN,
    university: demoUniversity._id,
    walletAddress: "0x1111111111111111111111111111111111111111",
  });

  const student = await upsertUser({
    name: "Ali Khan",
    email: "student@example.com",
    password,
    role: roles.STUDENT,
    walletAddress: "0x2222222222222222222222222222222222222222",
  });

  await upsertUser({
    name: "Employer User",
    email: "employer@example.com",
    password,
    role: roles.EMPLOYER,
  });

  await upsertUser({
    name: "Audit Officer",
    email: "auditor@example.com",
    password,
    role: roles.AUDITOR,
  });

  const issueDate = new Date("2026-05-19T00:00:00.000Z");
  const degreePayload = {
    studentName: "Ali Khan",
    studentEmail: student.email,
    studentWallet: student.walletAddress,
    degreeTitle: "BS Computer Science",
    department: "Computer Science",
    graduationYear: 2026,
    universityId: demoUniversity._id,
    issueDate: issueDate.toISOString(),
  };
  const ipfsCID = await createDegreeMetadataCID(degreePayload);
  const degreeHash = createDegreeHash({ ...degreePayload, ipfsCID });

  let degree = await Degree.findOne({ degreeHash });

  if (!degree) {
    degree = await Degree.create({
      studentName: degreePayload.studentName,
      studentEmail: degreePayload.studentEmail,
      studentWallet: degreePayload.studentWallet,
      degreeTitle: degreePayload.degreeTitle,
      department: degreePayload.department,
      graduationYear: degreePayload.graduationYear,
      issueDate,
      university: demoUniversity._id,
      issuedBy: admin._id,
      ipfsCID,
      degreeHash,
    });
  }

  degree.qrCodeDataUrl = await createDegreeQrCode(degree._id);
  await degree.save();

  console.log("Demo data ready.");
  console.log("admin@example.com / ChangeMe123!");
  console.log("university@example.com / ChangeMe123!");
  console.log("student@example.com / ChangeMe123!");
  console.log("employer@example.com / ChangeMe123!");
  console.log("auditor@example.com / ChangeMe123!");
  console.log(`Sample degree ID: ${degree._id}`);
}

seedDemoData()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  });
