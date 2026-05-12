import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { hashPassword } from "../services/auth.service.js";
import { roles } from "../utils/roles.js";

async function seedSuperAdmin() {
  await connectDatabase();

  const email = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log(`Super admin already exists: ${email}`);
    process.exitCode = 0;
    return;
  }

  const admin = await User.create({
    name: process.env.SUPER_ADMIN_NAME || "Platform Admin",
    email,
    passwordHash: await hashPassword(process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!"),
    role: roles.SUPER_ADMIN,
    active: true,
  });

  console.log(`Super admin created: ${admin.email}`);
  console.log("Change the default password immediately in real deployments.");
}

seedSuperAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  });

