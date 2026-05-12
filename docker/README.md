# Docker Setup

This project includes a Docker Compose setup for infrastructure services:

```text
MongoDB
IPFS
Hardhat local Ethereum node
```

Run:

```powershell
docker compose up mongo ipfs hardhat
```

The app can also run manually from VS Code:

```powershell
npm.cmd start --workspace server
npm.cmd run dev --workspace client
```
