const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DegreeAttestation = await ethers.getContractFactory("DegreeAttestation");
  const degreeAttestation = await DegreeAttestation.deploy();

  await degreeAttestation.waitForDeployment();

  const address = await degreeAttestation.getAddress();
  const network = await ethers.provider.getNetwork();
  const deployment = {
    contractName: "DegreeAttestation",
    address,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name || "localhost"}.json`),
    JSON.stringify(deployment, null, 2)
  );

  console.log(`DegreeAttestation deployed to ${address}`);
  console.log(`Deployment saved with chainId ${deployment.chainId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
