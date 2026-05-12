import crypto from "crypto";
import { env } from "../config/env.js";

export async function createMockIpfsCID(payload) {
  const digest = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return `mock-ipfs-${digest.slice(0, 32)}`;
}

export async function createDegreeMetadataCID(payload) {
  if (!env.ipfsApiUrl) {
    return createMockIpfsCID(payload);
  }

  try {
    const metadata = JSON.stringify(payload, null, 2);
    const formData = new FormData();
    const file = new Blob([metadata], { type: "application/json" });

    formData.append("file", file, "degree-metadata.json");

    const response = await fetch(`${env.ipfsApiUrl}/api/v0/add?pin=true`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.Hash;
  } catch (error) {
    console.warn(`IPFS unavailable, using mock CID: ${error.message}`);
    return createMockIpfsCID(payload);
  }
}
