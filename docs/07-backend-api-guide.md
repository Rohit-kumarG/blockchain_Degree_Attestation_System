# Backend API Guide

## What We Built

The backend now has the main API surface for the project:

```text
Auth
Universities
Degrees
Verification
Audit logs
Analytics
```

## Run Backend

```powershell
cd C:\Users\hp\Desktop\Degree-Attestation-System
copy server\.env.example server\.env
npm.cmd install
npm.cmd run seed:admin --workspace server
npm.cmd start --workspace server
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Beginner Request Flow

```text
React / Postman
      |
      v
Express route
      |
      v
JWT middleware
      |
      v
Role middleware
      |
      v
Controller
      |
      v
Service / Model
      |
      +--> MongoDB
      +--> Blockchain read adapter
      +--> QR generation
```

## Main Endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/universities
POST /api/universities
PATCH /api/universities/:id/activate
PATCH /api/universities/:id/deactivate

GET  /api/degrees
GET  /api/degrees/:id
POST /api/degrees
PATCH /api/degrees/:id/revoke

GET  /api/verification/degrees/:id

GET  /api/audit-logs
GET  /api/analytics/dashboard
```

## Important Note

Degree issuance is currently implemented as an off-chain backend record with a generated `degreeHash`.

The smart contract already exists and is tested. In the next backend upgrade, we will connect real on-chain transaction confirmation using the deployed contract address and MetaMask/frontend transaction hashes.

