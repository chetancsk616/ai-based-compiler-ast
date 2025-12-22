# Student App
- Challenge interface for students
- Code editor, AI hints, test execution
- Firebase Authentication required
- No admin features

## Local Development
```bash
cd student-app
npm install
npm run dev
```
Runs on port 3000

## Build
```bash
npm run build
```
Output: `student-app/dist/`

## Environment Variables
Copy from client/.env or set:
- VITE_FIREBASE_* (all Firebase config)
- VITE_API_BASE_URL (backend API URL)

## Deploy
Deploy `dist/` folder to public hosting (Vercel, Netlify, Render, etc.)
