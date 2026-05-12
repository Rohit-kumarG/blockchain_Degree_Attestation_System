# Roles, Permissions, and Degree Data Model

## Why Roles Matter

In a degree attestation system, not every user should be able to do everything.

If any user could issue a degree, the whole system would be useless.

So we use role-based access control.

## Roles

```text
SUPER_ADMIN
Controls the platform, approves universities, manages high-level settings.

UNIVERSITY_ADMIN
Manages one university, can approve staff and revoke degrees from that university.

UNIVERSITY_STAFF
Issues degrees for their university if allowed.

STUDENT
Views their issued degrees and shares verification links.

EMPLOYER
Verifies degrees through QR or verification portal.

AUDITOR
Reads audit logs and verification history.
```

## Permission Matrix

```text
Action                         SUPER  UNI_ADMIN  UNI_STAFF  STUDENT  EMPLOYER  AUDITOR
Approve university             yes    no         no         no       no        no
Create university user         yes    yes        no         no       no        no
Issue degree                   no     yes        yes        no       no        no
Revoke degree                  yes    yes        no         no       no        no
View own degree                no     no         no         yes      no        no
Verify degree                  yes    yes        yes        yes      yes       yes
View audit logs                yes    limited    no         no       no        yes
View analytics                 yes    limited    no         no       no        limited
```

## Where Permissions Are Enforced

```text
Frontend
Shows or hides buttons and pages.

Backend
Protects API routes using JWT and role middleware.

Smart Contract
Protects blockchain actions using wallet address permissions.
```

Never trust frontend-only authorization.

## Degree Data Model

A degree has human-readable data and cryptographic proof data.

### Human Data

```text
studentName
studentEmail
studentWallet
degreeTitle
department
graduationYear
cgpa or grade
universityId
issuedBy
issueDate
```

### File and Proof Data

```text
ipfsCID
degreeHash
blockchainTxHash
contractAddress
chainId
qrCodeValue
revoked
revokedAt
revokedReason
```

## What Goes Into The Hash?

The degree hash should include fields that prove the certificate identity:

```text
studentName
studentWallet
degreeTitle
department
graduationYear
universityId
ipfsCID
issueDate
```

Important:

If a field is included in the hash, changing it later will break verification.

That is good for identity-critical fields.

That is bad for fields that need normal editing.

## What Goes To MongoDB?

```text
Full searchable degree record
User accounts
University profiles
Audit logs
Analytics counters
Verification attempts
Transaction hashes
```

## What Goes To IPFS?

```text
Degree PDF
Degree JSON metadata
Public verification metadata
```

Do not put highly private data on public IPFS unless it is encrypted first.

## What Goes To Blockchain?

```text
degreeHash
issuer university wallet
student wallet
ipfsCID hash or CID reference
issued timestamp
revoked status
```

Blockchain should store proof, not the entire document.

## Smart Contract State Model

Conceptually:

```text
universities[address] => University
degrees[bytes32] => DegreeRecord
```

Where:

```text
University
  name
  wallet
  active
  approvedAt

DegreeRecord
  degreeHash
  studentWallet
  universityWallet
  ipfsCID
  issuedAt
  revoked
```

## First Implementation Principle

We will build a small secure core first:

```text
approveUniversity()
issueDegree()
verifyDegree()
revokeDegree()
```

Then we will expand into dashboards, QR, IPFS, analytics, Docker, and advanced security.

