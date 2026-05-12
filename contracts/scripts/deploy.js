const { ethers } = require("hardhat");

async function main() {
  const DegreeAttestation = await ethers.getContractFactory("DegreeAttestation");
  const degreeAttestation = await DegreeAttestation.deploy();

  await degreeAttestation.waitForDeployment();

  console.log(`DegreeAttestation deployed to ${await degreeAttestation.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
