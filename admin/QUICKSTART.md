# Quick Start - Admin Project

## Installation
```bash
cd admin-project
npm run install:all
```

## Configure Environment
1. Edit `.env` file
2. Add your GROQ_API_KEY
3. Add your FIREBASE_SERVICE_ACCOUNT_BASE64

## Run Development
```bash
npm run dev
```
This starts:
- Server on http://localhost:4001
- Client on http://localhost:3001

## Run Separately
```bash
# Server only
npm run dev:server

# Client only  
npm run dev:client
```

## Build for Production
```bash
npm run build:client
npm start
```
