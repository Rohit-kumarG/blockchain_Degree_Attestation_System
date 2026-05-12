# Advanced Blockchain Degree Attestation System

This repository is a learning-first, production-style project for building a blockchain based degree attestation and verification platform.

## What We Are Building

A multi-university system where approved universities can issue degree proofs on a private Ethereum blockchain. Employers and students can later verify degrees using QR codes, IPFS content hashes, MongoDB records, and smart contract state.

## Main Technologies

```text
Frontend: React.js, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
Blockchain: Solidity, Hardhat, Ganache, Ethers.js
Storage: IPFS
Authentication: JWT, bcrypt, MetaMask signatures
DevOps: Docker
```

## Project Structure

```text
client/       React frontend
server/       Express backend API
contracts/    Solidity smart contracts and Hardhat tests
docker/       Docker-related setup
docs/         Learning notes, architecture, and project decisions
```

## Learning Rule

We will build this project step by step:

```text
Theory -> Architecture -> Implementation -> Testing -> Debugging -> Security -> Optimization
```

Do not skip the docs. They explain why the code exists.

## Current Features

```text
JWT login with bcrypt password hashing
Role-based API authorization
MongoDB Atlas/local MongoDB support
University management
Degree issuance with deterministic hash
IPFS metadata upload with mock fallback
QR code generation
Public degree verification
Audit logs
Analytics dashboard
Solidity smart contract
Hardhat tests
MetaMask transaction flow
Docker Compose infrastructure
```

## Quick Start

Install dependencies:

```powershell
npm.cmd install
```

Create backend env:

```powershell
copy server\.env.example server\.env
```

Seed admin:

```powershell
npm.cmd run seed:admin --workspace server
```

Run backend:

```powershell
npm.cmd start --workspace server
```

Run frontend:

```powershell
npm.cmd run dev --workspace client
```

Open:

```text
http://localhost:5173
```

Login:

```text
admin@example.com
ChangeMe123!
```

## Blockchain Flow

Run local Ethereum node:

```powershell
npm.cmd run node --workspace contracts
```

Deploy contract:

```powershell
npm.cmd run deploy:local --workspace contracts
```

Copy the deployed contract address into:

```text
server/.env
client/.env
```

Then restart backend and frontend.
