# Smart Contract V1 Explained

File:

```text
contracts/contracts/DegreeAttestation.sol
```

## What This Contract Does

This is the first trust core of our project.

It supports four main actions:

```text
approveUniversity()
issueDegree()
verifyDegree()
revokeDegree()
```

## Beginner Explanation

Think of the smart contract as a public register.

The register says:

```text
This university is trusted.
This degree hash was issued by that university.
This degree belongs to this student wallet.
This degree points to this IPFS CID.
This degree is valid or revoked.
```

## Important Solidity Concepts

### pragma

```solidity
pragma solidity ^0.8.24;
```

This tells the Solidity compiler which language version the contract expects.

### address

```solidity
address public superAdmin;
```

An `address` is an Ethereum account identity.

In our system:

```text
superAdmin = platform owner wallet
universityWallet = university issuer wallet
studentWallet = student wallet
```

### constructor

```solidity
constructor() {
    superAdmin = msg.sender;
}
```

The constructor runs once when the contract is deployed.

`msg.sender` is the wallet that sent the current transaction.

So the deployer becomes the super admin.

### struct

```solidity
struct University {
    string name;
    bool active;
    uint256 approvedAt;
}
```

A struct groups related data together.

It is like a small custom data type.

### mapping

```solidity
mapping(address => University) public universities;
mapping(bytes32 => DegreeRecord) private degrees;
```

A mapping is like a dictionary:

```text
key -> value
```

Here:

```text
university wallet address -> university data
degree hash -> degree record
```

### modifier

```solidity
modifier onlySuperAdmin() {
    require(msg.sender == superAdmin, "Only super admin can perform this action");
    _;
}
```

A modifier is reusable access-control logic.

The `_` means:

```text
If the check passes, continue running the actual function.
```

### require

```solidity
require(studentWallet != address(0), "Invalid student wallet");
```

`require` is a gate.

If the condition is false, the transaction fails and state changes are reverted.

### event

```solidity
event DegreeIssued(...);
```

Events are logs emitted by the contract.

Backend and frontend can listen to events to build audit logs and dashboards.

Events are cheaper than storing every detail in contract state.

## Function Workflow

### approveUniversity

```text
Only super admin can call it.
It registers a university wallet as trusted.
Without this, a university cannot issue degrees.
```

### issueDegree

```text
Only approved university can call it.
It stores the degree hash and proof information.
It prevents duplicate degree hashes.
```

### verifyDegree

```text
Anyone can call it.
It returns whether a degree exists and is not revoked.
It also returns useful proof details.
```

### revokeDegree

```text
Super admin or issuing university can call it.
It marks the degree invalid.
It keeps the original record for audit history.
```

## Security Lessons From V1

```text
We do not let random wallets issue degrees.
We reject empty degree hashes.
We reject empty IPFS CIDs.
We prevent duplicate degree hash issuance.
We keep revoked degrees visible instead of deleting them.
```

## Current Limitations

This is V1, so it is intentionally simple.

Later we will improve:

```text
OpenZeppelin AccessControl
custom errors for lower gas
better university metadata handling
degree ID strategy
privacy model
event indexing strategy
upgrade/deployment strategy
automated tests
```

