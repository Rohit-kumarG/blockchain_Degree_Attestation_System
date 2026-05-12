const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DegreeAttestation", function () {
  async function deployContractFixture() {
    const [superAdmin, university, student, attacker] = await ethers.getSigners();

    const DegreeAttestation = await ethers.getContractFactory("DegreeAttestation");
    const degreeAttestation = await DegreeAttestation.deploy();

    return {
      degreeAttestation,
      superAdmin,
      university,
      student,
      attacker,
    };
  }

  it("sets the deployer as the super admin", async function () {
    const { degreeAttestation, superAdmin } = await deployContractFixture();

    expect(await degreeAttestation.superAdmin()).to.equal(superAdmin.address);
  });

  it("allows the super admin to approve a university", async function () {
    const { degreeAttestation, university } = await deployContractFixture();

    await degreeAttestation.approveUniversity(university.address, "Example University");

    const registeredUniversity = await degreeAttestation.universities(university.address);

    expect(registeredUniversity.name).to.equal("Example University");
    expect(registeredUniversity.active).to.equal(true);
  });

  it("prevents unapproved wallets from issuing degrees", async function () {
    const { degreeAttestation, attacker, student } = await deployContractFixture();
    const degreeHash = ethers.id("degree-1");

    await expect(
      degreeAttestation
        .connect(attacker)
        .issueDegree(degreeHash, student.address, "bafy-degree-cid")
    ).to.be.revertedWith("Only approved university can perform this action");
  });

  it("allows an approved university to issue and verify a degree", async function () {
    const { degreeAttestation, university, student } = await deployContractFixture();
    const degreeHash = ethers.id("degree-1");

    await degreeAttestation.approveUniversity(university.address, "Example University");
    await degreeAttestation
      .connect(university)
      .issueDegree(degreeHash, student.address, "bafy-degree-cid");

    const verification = await degreeAttestation.verifyDegree(degreeHash);

    expect(verification.valid).to.equal(true);
    expect(verification.studentWallet).to.equal(student.address);
    expect(verification.universityWallet).to.equal(university.address);
    expect(verification.ipfsCID).to.equal("bafy-degree-cid");
    expect(verification.revoked).to.equal(false);
  });

  it("allows the issuing university to revoke a degree", async function () {
    const { degreeAttestation, university, student } = await deployContractFixture();
    const degreeHash = ethers.id("degree-1");

    await degreeAttestation.approveUniversity(university.address, "Example University");
    await degreeAttestation
      .connect(university)
      .issueDegree(degreeHash, student.address, "bafy-degree-cid");

    await degreeAttestation.connect(university).revokeDegree(degreeHash, "Issued by mistake");

    const verification = await degreeAttestation.verifyDegree(degreeHash);

    expect(verification.valid).to.equal(false);
    expect(verification.revoked).to.equal(true);
    expect(verification.revokedReason).to.equal("Issued by mistake");
  });
});
