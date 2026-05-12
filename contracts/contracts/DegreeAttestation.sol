// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DegreeAttestation {
    address public superAdmin;

    struct University {
        string name;
        bool active;
        uint256 approvedAt;
    }

    struct DegreeRecord {
        bytes32 degreeHash;
        address studentWallet;
        address universityWallet;
        string ipfsCID;
        uint256 issuedAt;
        bool revoked;
        string revokedReason;
    }

    mapping(address => University) public universities;
    mapping(bytes32 => DegreeRecord) private degrees;

    event UniversityApproved(address indexed universityWallet, string name, uint256 approvedAt);
    event UniversityDeactivated(address indexed universityWallet, uint256 deactivatedAt);
    event DegreeIssued(
        bytes32 indexed degreeHash,
        address indexed studentWallet,
        address indexed universityWallet,
        string ipfsCID,
        uint256 issuedAt
    );
    event DegreeRevoked(bytes32 indexed degreeHash, string reason, uint256 revokedAt);

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only super admin can perform this action");
        _;
    }

    modifier onlyApprovedUniversity() {
        require(universities[msg.sender].active, "Only approved university can perform this action");
        _;
    }

    modifier degreeExists(bytes32 degreeHash) {
        require(degrees[degreeHash].issuedAt != 0, "Degree does not exist");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
    }

    function approveUniversity(address universityWallet, string calldata name) external onlySuperAdmin {
        require(universityWallet != address(0), "Invalid university wallet");
        require(bytes(name).length > 0, "University name is required");

        universities[universityWallet] = University({
            name: name,
            active: true,
            approvedAt: block.timestamp
        });

        emit UniversityApproved(universityWallet, name, block.timestamp);
    }

    function deactivateUniversity(address universityWallet) external onlySuperAdmin {
        require(universities[universityWallet].approvedAt != 0, "University is not registered");

        universities[universityWallet].active = false;

        emit UniversityDeactivated(universityWallet, block.timestamp);
    }

    function issueDegree(
        bytes32 degreeHash,
        address studentWallet,
        string calldata ipfsCID
    ) external onlyApprovedUniversity {
        require(degreeHash != bytes32(0), "Invalid degree hash");
        require(studentWallet != address(0), "Invalid student wallet");
        require(bytes(ipfsCID).length > 0, "IPFS CID is required");
        require(degrees[degreeHash].issuedAt == 0, "Degree already issued");

        degrees[degreeHash] = DegreeRecord({
            degreeHash: degreeHash,
            studentWallet: studentWallet,
            universityWallet: msg.sender,
            ipfsCID: ipfsCID,
            issuedAt: block.timestamp,
            revoked: false,
            revokedReason: ""
        });

        emit DegreeIssued(degreeHash, studentWallet, msg.sender, ipfsCID, block.timestamp);
    }

    function revokeDegree(
        bytes32 degreeHash,
        string calldata reason
    ) external degreeExists(degreeHash) {
        DegreeRecord storage record = degrees[degreeHash];

        require(
            msg.sender == superAdmin || msg.sender == record.universityWallet,
            "Only super admin or issuing university can revoke"
        );
        require(!record.revoked, "Degree is already revoked");
        require(bytes(reason).length > 0, "Revocation reason is required");

        record.revoked = true;
        record.revokedReason = reason;

        emit DegreeRevoked(degreeHash, reason, block.timestamp);
    }

    function verifyDegree(
        bytes32 degreeHash
    )
        external
        view
        degreeExists(degreeHash)
        returns (
            bool valid,
            address studentWallet,
            address universityWallet,
            string memory ipfsCID,
            uint256 issuedAt,
            bool revoked,
            string memory revokedReason
        )
    {
        DegreeRecord memory record = degrees[degreeHash];

        return (
            !record.revoked,
            record.studentWallet,
            record.universityWallet,
            record.ipfsCID,
            record.issuedAt,
            record.revoked,
            record.revokedReason
        );
    }
}
