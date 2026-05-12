# Advanced Blockchain Based Degree Attestation System

## Mentor Note

This project is our blockchain engineering bootcamp. We will not memorize tools first. We will understand the problem, design the system, then implement each layer with testing, debugging, and security thinking.

The project goal is simple to say:

> A real degree should be easy to verify, and a fake or modified degree should be easy to detect.

The engineering goal is bigger:

> Learn how frontend, backend, database, IPFS, wallets, smart contracts, and a private Ethereum blockchain work together in a production-style Web3 system.

## 1. What Problem Are We Solving?

Traditional degree verification usually depends on manual checks:

```text
Employer -> Contacts university -> University searches records -> Sends confirmation
```

Problems:

```text
Slow verification
Fake documents
Manual human errors
No public proof
Hard cross-university verification
No strong audit trail
```

Our system changes the model:

```text
University issues degree
System creates a cryptographic fingerprint
Fingerprint is stored on blockchain
Employer later verifies the degree against that fingerprint
```

The important idea:

```text
We do not trust the uploaded PDF blindly.
We verify its fingerprint against blockchain proof.
```

## 2. Beginner Mental Model

Think of a degree as a real-world document.

Think of a hash as its fingerprint.

Think of blockchain as a public tamper-evident register.

Think of IPFS as a content-addressed file storage system.

Think of MongoDB as the searchable application database.

Think of the backend as the rule-enforcing office clerk.

Think of the smart contract as the strict public rulebook that nobody can secretly edit.

## 3. Core Architecture

```text
                         Users
       Admin / University / Student / Employer
                           |
                           v
                    React Frontend
                           |
                           v
                    Express Backend
          validation, auth, business rules, logs
              |              |              |
              v              v              v
          MongoDB          IPFS       Ethereum Node
       app records       files       private blockchain
                                          |
                                          v
                                  Smart Contract
                              degree proof registry
```

## 4. What Goes Where?

### MongoDB

MongoDB stores data the application needs to search and display:

```text
Users
Universities
Students
Degree metadata
Audit logs
Verification attempts
Analytics data
Transaction hashes
```

MongoDB is fast and flexible, but its records can be changed by someone with database access. That is why it is not enough for trust.

### IPFS

IPFS stores degree documents or degree metadata files.

It returns a CID, which is like a content address:

```text
file content -> CID
```

If file content changes, the CID changes.

### Blockchain

Blockchain stores the proof:

```text
degreeHash
studentWallet
universityWallet
ipfsCIDHash
issuedAt
revoked status
```

We avoid storing large files on-chain because blockchain storage is expensive, slow, and permanent.

### Smart Contract

The smart contract enforces rules:

```text
Only approved universities can issue degrees.
Only authorized roles can revoke degrees.
Issued degree hashes can be verified.
Revoked degrees are not valid.
Important actions emit events for audit history.
```

## 5. Degree Issuance Workflow

```text
1. University admin logs in
2. Backend verifies JWT and role
3. Admin enters student and degree information
4. Backend validates the data
5. Backend uploads degree document or metadata to IPFS
6. IPFS returns CID
7. Backend builds canonical degree payload
8. Backend hashes the payload
9. University wallet signs blockchain transaction
10. Smart contract checks university permission
11. Smart contract stores degree proof
12. Backend stores app record and transaction hash in MongoDB
13. System generates QR code for public verification
```

Diagram:

```text
University Dashboard
        |
        v
Express API
        |
        +--> MongoDB: save pending degree
        |
        +--> IPFS: upload file and get CID
        |
        +--> Hash Engine: create degree hash
        |
        +--> Smart Contract: issueDegree(hash)
        |
        v
MongoDB: save confirmed transaction
```

## 6. Degree Verification Workflow

```text
1. Employer scans QR code
2. Frontend opens verification page
3. Backend fetches degree metadata from MongoDB
4. Backend fetches or checks IPFS CID
5. Backend recomputes degree hash
6. Backend reads blockchain contract
7. System compares computed hash with blockchain hash
8. System checks revocation status
9. Result is shown: valid, revoked, unknown, or tampered
```

Diagram:

```text
Employer
   |
   v
QR Verification Page
   |
   v
Backend Verification API
   |
   +--> MongoDB record
   +--> IPFS CID/file proof
   +--> Blockchain proof
   |
   v
Verification result
```

## 7. Fake Degree Detection

Fake detection works because hashes are extremely sensitive.

Original payload:

```text
studentName: Ali Khan
degreeTitle: BS Computer Science
university: Example University
graduationYear: 2026
ipfsCID: bafy...
```

If someone changes even one field:

```text
degreeTitle: MS Computer Science
```

The generated hash becomes different.

Verification logic:

```text
computedHash == blockchainHash -> valid
computedHash != blockchainHash -> tampered or fake
hash not found on-chain -> not issued by system
hash found but revoked -> previously issued but no longer valid
```

## 8. Authentication and Roles

We will use two identity systems together.

### Traditional identity

```text
email + password -> bcrypt password hash -> JWT session
```

Used for:

```text
Admin dashboards
Backend API access
User management
Analytics
Audit log access
```

### Web3 identity

```text
wallet address + signature -> proof of wallet ownership
```

Used for:

```text
Blockchain transactions
University issuer identity
Smart contract permissions
MetaMask transaction signing
```

Important rule:

```text
Frontend role checks are for user experience.
Backend role checks protect APIs.
Smart contract role checks protect blockchain state.
```

## 9. Transaction Lifecycle

When a university issues a degree on-chain:

```text
1. Function call is prepared: issueDegree(...)
2. MetaMask shows transaction details
3. University signs with private key
4. Transaction is sent to Ethereum node
5. Node validates signature and nonce
6. Transaction waits in mempool
7. Validator/miner includes it in a block
8. EVM executes smart contract code
9. Contract state changes if all checks pass
10. Event is emitted
11. Transaction receipt is returned
```

## 10. Security Questions We Must Always Ask

```text
Who is allowed to issue a degree?
Who is allowed to approve universities?
Who can revoke a degree?
Can someone change metadata after issuing?
Can someone reuse a QR code maliciously?
Can a compromised backend issue fake degrees?
Where are private keys stored?
What happens if MongoDB is modified?
What happens if IPFS content is unavailable?
What should be public and what should stay private?
```

## 11. Professional Folder Structure

We will build toward this:

```text
degree-attestation-system/
  client/
    src/
      components/
      pages/
      hooks/
      services/
      routes/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      validators/
  contracts/
    contracts/
    scripts/
    test/
    hardhat.config.js
  docker/
  docs/
  docker-compose.yml
  README.md
```

## 12. Development Roadmap

### Phase 1: Foundation and Architecture

Goals:

```text
Understand blockchain basics
Understand the full system workflow
Design roles and permissions
Design data models
Design smart contract state
Create project structure
```

Deliverables:

```text
Architecture documentation
Role permission matrix
Degree lifecycle diagram
Initial folder structure
```

### Phase 2: Smart Contract Fundamentals

Goals:

```text
Learn Solidity from zero
Build DegreeAttestation contract
Test issue, verify, revoke flows
Learn events, mappings, structs, modifiers
```

### Phase 3: Backend API

Goals:

```text
Build Express server
Add MongoDB models
Add JWT authentication
Add role middleware
Add blockchain service using ethers.js
Add IPFS service
```

### Phase 4: Frontend

Goals:

```text
Build React + Tailwind UI
Add login and dashboards
Add university degree issuance form
Add employer verification portal
Add MetaMask connection
```

### Phase 5: Advanced Features

Goals:

```text
QR verification
Audit logs
Analytics dashboard
Multi-university support
Revocation flows
Fraud attempt detection
```

### Phase 6: Docker and Deployment

Goals:

```text
Dockerize services
Run MongoDB, IPFS, backend, frontend, blockchain locally
Prepare private-chain deployment concepts
```

### Phase 7: Security Hardening

Goals:

```text
Smart contract access control review
Backend API security
Input validation
Rate limiting
Private key safety
IPFS privacy model
Replay attack prevention
Audit trail integrity
```

## 13. What We Do Next

Next lesson and build step:

```text
Design the exact roles and permissions.
Design the degree data model.
Design the smart contract storage model.
Then initialize the actual project folders.
```

Before code, we must answer:

```text
What is a degree in our system?
What fields make a degree unique?
Which fields are public?
Which fields are private?
Which fields are hashed?
Which fields go to MongoDB?
Which fields go to IPFS?
Which fields go to blockchain?
```

That is the correct engineering start.
