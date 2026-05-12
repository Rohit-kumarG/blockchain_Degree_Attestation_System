# Blockchain Integration Guide

## What We Added

The app can now start connecting real UI actions to the smart contract.

New frontend actions:

```text
Approve university on-chain
Issue degree on-chain
Save blockchain transaction hash in backend
```

## Important Concept

There are now two steps in degree issuance:

```text
1. Backend creates the degree record, hash, IPFS CID placeholder, and QR code.
2. MetaMask sends a transaction to the smart contract using that degree hash.
```

Why two steps?

```text
Backend prepares clean data.
Blockchain stores tamper-proof proof.
```

## Local Blockchain Flow

Terminal 1:

```powershell
cd C:\Users\hp\Desktop\Degree-Attestation-System
npx hardhat node --prefix contracts
```

Terminal 2:

```powershell
cd C:\Users\hp\Desktop\Degree-Attestation-System
npm.cmd run deploy:local --workspace contracts
```

Copy the deployed contract address.

Set it in:

```text
server/.env
client/.env
```

Example:

```text
DEGREE_CONTRACT_ADDRESS=0x...
VITE_DEGREE_CONTRACT_ADDRESS=0x...
```

## MetaMask Setup

Add local network:

```text
Network name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency: ETH
```

Import one Hardhat account private key into MetaMask.

## On-Chain Issuance Flow

```text
Create university in app
Approve university on-chain with super admin wallet
Create degree in app
Click Issue on-chain using approved university wallet
MetaMask signs transaction
Smart contract stores degree hash
Backend saves tx hash
Verification compares backend hash and blockchain state
```

## Beginner Warning

If MetaMask says the transaction reverted, usually one of these happened:

```text
Wrong wallet selected
University not approved on-chain
Contract address missing
Wrong network selected
Degree already issued on-chain
```

