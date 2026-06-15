import { ethers } from "ethers";

export const degreeContractAbi = [
  "function approveUniversity(address universityWallet,string name)",
  "function issueDegree(bytes32 degreeHash,address studentWallet,string ipfsCID)",
  "function verifyDegree(bytes32 degreeHash) view returns (bool valid,address studentWallet,address universityWallet,string ipfsCID,uint256 issuedAt,bool revoked,string revokedReason)",
  "function payFee(bytes32 degreeHash) payable",
];

export function getConfiguredContractAddress() {
  return import.meta.env.VITE_DEGREE_CONTRACT_ADDRESS || "";
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  return {
    address: accounts[0],
    chainId: Number(network.chainId),
    provider,
    signer: await provider.getSigner(),
  };
}

export async function getDegreeContract() {
  const contractAddress = getConfiguredContractAddress();

  if (!contractAddress) {
    throw new Error("VITE_DEGREE_CONTRACT_ADDRESS is not configured");
  }

  const wallet = await connectWallet();

  return {
    ...wallet,
    contractAddress,
    contract: new ethers.Contract(contractAddress, degreeContractAbi, wallet.signer),
  };
}

export async function approveUniversityOnChain({ universityWallet, name }) {
  const { contract, contractAddress, chainId } = await getDegreeContract();
  const tx = await contract.approveUniversity(universityWallet, name);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress,
    chainId,
  };
}

export async function payAttestationFeeOnChain({ degreeHash }) {
  const { contract, contractAddress, chainId } = await getDegreeContract();
  const fee = ethers.parseEther("0.001");
  const tx = await contract.payFee(degreeHash, { value: fee });
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress,
    chainId,
  };
}

export async function issueDegreeOnChain({ degreeHash, studentWallet, ipfsCID }) {
  const { contract, contractAddress, chainId } = await getDegreeContract();
  const tx = await contract.issueDegree(degreeHash, studentWallet, ipfsCID);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress,
    chainId,
  };
}

