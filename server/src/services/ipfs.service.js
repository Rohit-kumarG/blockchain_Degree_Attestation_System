import crypto from "crypto";

export async function createMockIpfsCID(payload) {
  const digest = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return `mock-ipfs-${digest.slice(0, 32)}`;
}

