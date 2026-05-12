# Backend Foundation

## What Is The Backend?

The backend is the secure middle layer between users, database, IPFS, and blockchain.

In our project, the backend is built with:

```text
Node.js + Express.js
```

## Beginner Explanation

Think of the backend as the university office.

The frontend is the reception desk UI.

MongoDB is the filing cabinet.

IPFS is the document storage room.

Blockchain is the permanent public proof register.

The backend decides:

```text
Who is logged in?
What role does this user have?
Is the request valid?
Should this degree be issued?
Should this verification attempt be logged?
What blockchain transaction should happen?
```

## Why We Need A Backend If We Have Blockchain

Blockchain is not good for everything.

Blockchain is good for:

```text
immutable proof
public verification
role enforcement at contract level
audit events
```

Backend is good for:

```text
login
password hashing
JWT sessions
form validation
MongoDB queries
analytics
rate limiting
file upload
IPFS integration
error handling
```

## Backend Responsibilities

```text
Authentication
Authorization
Degree data validation
MongoDB persistence
IPFS upload
Blockchain transaction coordination
Audit logging
Analytics aggregation
Fraud attempt tracking
```

## Backend Folder Structure

```text
server/src/
  index.js
  app.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
```

## What Each Folder Means

### config

Environment variables and database configuration.

### controllers

Functions that handle HTTP requests.

Example:

```text
verifyDegreeController()
issueDegreeController()
loginController()
```

### middleware

Code that runs before controllers.

Example:

```text
check JWT
check user role
validate request body
rate limit requests
```

### models

MongoDB schemas.

Example:

```text
User
University
Degree
AuditLog
VerificationAttempt
```

### routes

API endpoint definitions.

Example:

```text
GET /api/health
POST /api/auth/login
POST /api/degrees
GET /api/degrees/verify/:id
```

### services

Business logic that talks to external systems.

Example:

```text
blockchainService
ipfsService
hashService
authService
```

### utils

Small reusable helpers.

### validators

Request validation rules.

## First Backend Milestone

We will build:

```text
Express app
security middleware
JSON parsing
health route
central error handler
environment config
not found handler
```

This seems small, but it is the foundation for every future API.

## Request Flow

```text
Browser / React
      |
      v
Express route
      |
      v
Middleware
      |
      v
Controller
      |
      v
Service
      |
      +--> MongoDB
      +--> IPFS
      +--> Blockchain
```

## Security From Day One

We will use:

```text
helmet
cors
dotenv
central error handling
controlled JSON body size
role middleware later
JWT middleware later
```

Security is not something we add at the end. We build it into the structure.

