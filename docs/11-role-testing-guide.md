# Role Testing Guide

## Seed Demo Users

Run:

```powershell
npm.cmd run seed:demo --workspace server
```

All demo users use:

```text
ChangeMe123!
```

## Demo Accounts

```text
admin@example.com
Role: SUPER_ADMIN
Sees: Dashboard, Universities, Degrees, Verify, Audit Logs, Role Guide

university@example.com
Role: UNIVERSITY_ADMIN
Sees: Dashboard, Degrees, Verify, Role Guide

student@example.com
Role: STUDENT
Sees: Degrees, Verify, Role Guide

employer@example.com
Role: EMPLOYER
Sees: Verify, Role Guide

auditor@example.com
Role: AUDITOR
Sees: Dashboard, Verify, Audit Logs, Role Guide
```

## What To Test

### Admin

```text
Login as admin.
Open Universities.
Create or view Demo University.
Open Degrees.
Issue a degree.
Open Audit Logs.
Check system activity.
```

### Student

```text
Login as student.
Open Degrees.
Student should only see their own degrees.
Student should not see Universities or Audit Logs.
Copy degree ID.
```

### Employer

```text
Login as employer.
Employer should only see Verify and Role Guide.
Paste degree ID into Verify.
Employer sees VALID / REVOKED / TAMPERED result.
```

### Auditor

```text
Login as auditor.
Open Audit Logs.
Auditor can inspect activity but does not issue degrees.
```

## Audit Log Meaning

Audit logs are the history of important system actions:

```text
who logged in
who created a university
who issued a degree
who revoked a degree
who confirmed blockchain transaction
who verified a degree
```

Audit logs help detect misuse and prove accountability.

