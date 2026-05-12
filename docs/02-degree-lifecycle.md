# Degree Lifecycle: From Issuance to Verification

## Goal

Before writing backend, frontend, or smart contract code, we need to understand the journey of one degree through the system.

The central question:

> How does the system know that a degree is real and has not been modified?

The answer:

> The system compares a freshly computed hash with the original hash stored on blockchain.

## Simple Explanation

A degree document is like a physical certificate.

A hash is like a fingerprint of that certificate.

Blockchain is like a permanent register where the fingerprint is recorded.

If someone changes the certificate, its fingerprint changes.

## Issuance Flow

```text
University admin
      |
      v
React issuance form
      |
      v
Express backend
      |
      +--> Validate user role
      +--> Validate degree fields
      +--> Upload document or metadata to IPFS
      +--> Create canonical payload
      +--> Generate degree hash
      +--> Send transaction to smart contract
      +--> Save record in MongoDB
      |
      v
QR code generated
```

## Verification Flow

```text
Employer scans QR
      |
      v
React verification page
      |
      v
Express verification API
      |
      +--> Find degree record in MongoDB
      +--> Check IPFS CID
      +--> Recreate canonical payload
      +--> Generate fresh hash
      +--> Read blockchain proof
      +--> Compare hashes
      +--> Check revoked status
      |
      v
Verification result
```

## Possible Verification Results

```text
VALID
The degree exists on-chain, the hash matches, and it is not revoked.

REVOKED
The degree was once issued but later revoked by an authorized university/admin.

TAMPERED
MongoDB/IPFS/submitted data does not match the blockchain proof.

NOT_FOUND
No blockchain proof exists for this degree hash.

UNTRUSTED_UNIVERSITY
The claimed issuer is not approved in the smart contract.
```

## Why Hashing Matters

Suppose this is the original degree payload:

```json
{
  "studentName": "Ali Khan",
  "degreeTitle": "BS Computer Science",
  "universityName": "Example University",
  "graduationYear": 2026,
  "ipfsCID": "bafy..."
}
```

The system creates a hash:

```text
0xabc123...
```

If a fake degree changes this:

```json
{
  "degreeTitle": "MS Computer Science"
}
```

The hash becomes totally different.

That is why fake degree detection works.

## Beginner to Advanced View

### Beginner

We store a fingerprint on blockchain.

### Intermediate

The fingerprint is generated from a canonical payload, meaning the data is ordered and formatted consistently before hashing.

### Advanced

The smart contract should store only minimum necessary proof, emit events, and avoid large or sensitive data. The backend should verify both off-chain records and on-chain state.

### Industry Approach

In real systems, blockchain is not used as a database replacement. It is used as a trust anchor.

```text
MongoDB = searchable records
IPFS = file/content storage
Blockchain = immutable proof
```

