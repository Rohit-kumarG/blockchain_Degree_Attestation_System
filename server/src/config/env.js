import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/degree_attestation",
  jwtSecret: process.env.JWT_SECRET || "development_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
  ipfsApiUrl: process.env.IPFS_API_URL || "",
  chainRpcUrl: process.env.CHAIN_RPC_URL || "http://127.0.0.1:8545",
  chainId: Number(process.env.CHAIN_ID || 31337),
  degreeContractAddress: process.env.DEGREE_CONTRACT_ADDRESS || "",
};
