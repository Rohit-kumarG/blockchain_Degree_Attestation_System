# Frontend Guide

## What We Built

The React frontend now has:

```text
Login screen
Operations dashboard
University management screen
Degree issuance screen
Degree verification screen
API service
Session storage
Tailwind styling
Responsive app shell
```

## Run Frontend

Backend must be running first:

```powershell
npm.cmd start --workspace server
```

Then run frontend:

```powershell
npm.cmd run dev --workspace client
```

Open:

```text
http://localhost:5173
```

## Beginner Flow

```text
React form
   |
   v
apiRequest()
   |
   v
Express backend
   |
   v
MongoDB / Blockchain service
   |
   v
JSON response
   |
   v
React updates the screen
```

## Login

Use the seeded admin:

```text
admin@example.com
ChangeMe123!
```

