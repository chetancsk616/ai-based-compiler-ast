# Admin App Deployment
- Admin panel for managing questions, submissions, users
- Firebase Authentication required
- Admin custom claim required for access

## Local Development
```bash
cd admin-app
npm install
npm run dev
```
Runs on port 3001

## Build
```bash
npm run build
```
Output: `admin-app/dist/`

## Environment Variables
Copy from client/.env or set:
- VITE_FIREBASE_* (all Firebase config)
- VITE_API_BASE_URL (backend API URL)

## Deploy
Deploy `dist/` folder separately from student app.
Recommended: internal network or restricted access.
