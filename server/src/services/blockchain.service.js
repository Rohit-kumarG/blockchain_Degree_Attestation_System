import { ethers } from "ethers";
import { env } from "../config/env.js";

const degreeAttestationAbi = [
  "function approveUniversity(address universityWallet,string name)",
  "function issueDegree(bytes32 degreeHash,address studentWallet,string ipfsCID)",
  "function revokeDegree(bytes32 degreeHash,string reason)",
  "function verifyDegree(bytes32 degreeHash) view returns (bool valid,address studentWallet,address universityWallet,string ipfsCID,uint256 issuedAt,bool revoked,string revokedReason)",
];

export function getProvider() {
  return new ethers.JsonRpcProvider(env.chainRpcUrl);
}

export function getDegreeContract(signerOrProvider = getProvider()) {
  if (!env.degreeContractAddress) {
    return null;
  }

  return new ethers.Contract(env.degreeContractAddress, degreeAttestationAbi, signerOrProvider);
}

export async function readDegreeFromBlockchain(degreeHash) {
  const contract = getDegreeContract();

  if (!contract) {
    return {
      configured: false,
      exists: false,
      valid: false,
      reason: "DEGREE_CONTRACT_ADDRESS is not configured",
    };
  }

  try {
    const result = await contract.verifyDegree(degreeHash);

    return {
      configured: true,
      exists: true,
      valid: result.valid,
      studentWallet: result.studentWallet,
      universityWallet: result.universityWallet,
      ipfsCID: result.ipfsCID,
      issuedAt: Number(result.issuedAt),
      revoked: result.revoked,
      revokedReason: result.revokedReason,
    };
  } catch (error) {
    return {
      configured: true,
      exists: false,
      valid: false,
      reason: error.shortMessage || error.message,
    };
  }
}

