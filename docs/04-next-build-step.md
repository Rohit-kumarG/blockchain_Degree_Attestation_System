# Next Build Step: Smart Contract Core

## Why We Start With Smart Contracts

The smart contract is the trust core of the system.

If the contract is weak, the whole system is weak.

So we will build the smallest useful contract first:

```text
approveUniversity()
issueDegree()
verifyDegree()
revokeDegree()
```

## Beginner Meaning

The contract is a rulebook stored on blockchain.

It decides:

```text
who can issue a degree
which degree hashes are valid
which degrees are revoked
which universities are trusted
```

## What You Must Understand Before Coding Solidity

```text
address
msg.sender
mapping
struct
event
modifier
require
bytes32
transaction
gas
```

## Our First Smart Contract Data

```text
admin address
approved university wallets
degree hash records
revocation status
```

## Next Lesson

We will learn Solidity basics through the actual `DegreeAttestation.sol` contract.

We will write a simple version first, then improve it like professionals.

