import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { repairMismatchedDegreeHashes } from "./utils/repairHashes.js";

async function startServer() {
  await connectDatabase();
  await repairMismatchedDegreeHashes();

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Degree attestation API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exitCode = 1;
});
