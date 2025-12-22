# Unified Login Page - Setup & Architecture

## Overview

Your AI Web Compiler now features a **unified login page** that serves as the main entry point for both students and admins. This eliminates separate login screens and provides a seamless authentication experience.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Unified Login Page (Port 3000)                    │
│   • Dropdown: Select Student or Admin                       │
│   • Email/Password Login                                    │
│   • Google Sign-In                                          │
│   • Admin Role Verification                                 │
└────────┬───────────────────────────────────────────────────┘
         │
         ├─→ Admin Portal (Port 3001)     ← Admin User
         │   • Question Manager
         │   • User Management
         │   • Submissions Viewer
         │
         └─→ Student Portal (Port 3002)   ← Student User
             • Problem Solving
             • Code Execution
             • AI Assistance
```

## Project Structure

```
ai-web-compiler/
├── login/                          # NEW: Unified Login App
│   ├── src/
│   │   ├── Login.jsx               # Main login component with dropdown
│   │   ├── AuthContext.jsx         # Firebase auth state management
│   │   ├── firebase.js             # Firebase config
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Tailwind styles
│   ├── package.json
│   ├── vite.config.js              # Port 3000
│   ├── .env                        # Firebase credentials
│   ├── index.html
│   └── node_modules/
│
├── admin/                          # Admin Project
│   ├── client/                     # Frontend (Port 3001)
│   ├── server/                     # Backend (Port 4001)
│   └── package.json
│
├── student/                        # Student Project
│   ├── client/                     # Frontend (Port 3002)
│   ├── server/                     # Backend (Port 5001)
│   └── package.json
│
├── package.json                    # Root commands (see below)
├── START.md                        # Quick start guide
└── ...
```

## Ports Configuration

| App | Port | Purpose |
|-----|------|---------|
| Login Page | 3000 | Main entry point for authentication |
| Admin Client | 3001 | Admin dashboard & interface |
| Admin API | 4001 | Admin backend endpoints |
| Student Client | 3002 | Student portal & IDE |
| Student API | 5001 | Student backend endpoints |

## Available Commands

Run from project root (`ai-web-compiler/`):

```bash
# Start everything (all 5 apps)
npm run dev

# Start individual apps
npm run dev:login              # Login page only
npm run dev:admin              # Admin client + server
npm run dev:student            # Student client + server
npm run dev:login-only         # Login page only (alternate)
npm run dev:admin-only         # Admin client + server (alternate)
npm run dev:student-only       # Student client + server (alternate)

# Install dependencies
npm run install:all            # Install all dependencies for all projects

# Build for production
npm run build                  # Build all apps
npm run build:login            # Build login app
npm run build:admin            # Build admin client
npm run build:student          # Build student client

# Production start
npm run start                  # Start servers in production
npm run start:login            # Login page (preview mode)
npm run start:admin            # Admin server
npm run start:student          # Student server
```

## Login Features

### 1. User Type Selection
- **Dropdown Menu**: Choose between "Student" or "Admin"
- **Email/Password**: Standard login method
- **Google Sign-In**: One-click authentication

### 2. Authentication Flow

```
User selects "Student" or "Admin"
         ↓
Enters credentials
         ↓
Submits form
         ↓
Firebase authentication
         ↓
Role verification (for Admin)
         ↓
Redirect to appropriate portal
         ↓
Access granted
```

### 3. Admin Role Protection
- Admins must have the `role: "admin"` custom claim in Firebase
- Non-admins attempting admin login receive error
- Use Firebase Console to set admin role on user accounts

### 4. Automatic Redirection
After successful login:
- **Student**: Redirected to `http://localhost:3002` (Student Portal)
- **Admin**: Redirected to `http://localhost:3001` (Admin Portal)

## Environment Setup

### 1. Login App Environment (`.env` in `login/`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Admin App Environment (`.env` in `admin/`)

```env
PORT=4001
API_PREFIX=/api
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
ADMIN_EMAILS=your.email@example.com
```

### 3. Student App Environment (`.env` in `student/`)

```env
PORT=5001
API_PREFIX=/api
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
```

## Getting Started

### First Time Setup

```bash
# 1. Navigate to project root
cd ai-web-compiler

# 2. Install all dependencies
npm run install:all

# 3. Configure environment variables
# Edit the following .env files with your Firebase and Groq credentials:
# - login/.env
# - admin/.env
# - student/.env

# 4. Start everything
npm run dev
```

### Access Points

After running `npm run dev`, open these URLs:

1. **Login Page** (Start here): http://localhost:3000
2. **Admin Portal** (after login as admin): http://localhost:3001
3. **Student Portal** (after login as student): http://localhost:3002

## Demo Credentials

These demo accounts are configured:

```
Student Account:
  Email: student@test.com
  Password: password123

Admin Account:
  Email: admin@test.com
  Password: admin123
```

**Note**: These credentials won't work until you create matching accounts in Firebase and set the appropriate roles.

## Troubleshooting

### Login Page Not Loading

```bash
# Check if port 3000 is free
lsof -i :3000          # macOS/Linux
netstat -ano | find ":3000"  # Windows

# Kill process if needed (Windows)
taskkill /PID <process_id> /F
```

### Firebase Auth Not Working

1. Verify Firebase config in `login/.env`
2. Check Firebase Console for correct API key
3. Ensure Firebase Authentication is enabled
4. Check firebaseConfig variables match your project

### Admin Login Fails

1. User account must exist in Firebase
2. User must have custom claim `role: "admin"`
3. Set admin role via Firebase Console:
   - Go to Authentication → Users
   - Click user email
   - Custom claims (JSON):
     ```json
     {"role": "admin"}
     ```

### Port Already in Use

```bash
# Windows: Kill process using port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux: Kill process using port
lsof -ti:3000 | xargs kill -9
```

## Login Component Details

### Login.jsx Features

- **Dropdown Selection**: Student/Admin mode toggle
- **Email Input**: Standard email field
- **Password Input**: Secure password field
- **Email/Password Login**: Firebase email/password auth
- **Google Sign-In**: One-click Google authentication
- **Error Handling**: Clear error messages for common issues
- **Loading States**: Disabled inputs during authentication
- **Auto-Redirect**: Automatic redirect after successful login
- **Role Verification**: Checks admin custom claims

### AuthContext.jsx Features

- **Firebase Integration**: Real-time auth state management
- **User Detection**: Monitors login/logout status
- **Role Fetching**: Retrieves user's role from JWT claims
- **Auto-Logout**: Cleans up state on logout
- **Provider Pattern**: Makes auth available throughout app

## Security Considerations

1. **Custom Claims**: Admin role must be set via Firebase Admin SDK
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files
4. **JWT Tokens**: Automatically handled by Firebase
5. **CORS**: Configured for localhost development
6. **Password Requirements**: Set in Firebase Authentication settings

## Next Steps

1. ✅ **Unified Login Created**
2. 📋 **Configure Firebase Credentials**
   - Get API key from Firebase Console
   - Set admin custom claims for admin users
3. 🚀 **Run the System**
   - Execute `npm run dev`
   - Navigate to http://localhost:3000
   - Test login flow for both student and admin
4. 📱 **Test Features**
   - Verify redirects work correctly
   - Test admin features (questions, users)
   - Test student features (problem solving)

## File Locations

| File | Purpose |
|------|---------|
| [login/src/Login.jsx](login/src/Login.jsx) | Main login component with dropdown |
| [login/src/AuthContext.jsx](login/src/AuthContext.jsx) | Auth state management |
| [login/src/firebase.js](login/src/firebase.js) | Firebase configuration |
| [login/package.json](login/package.json) | Login app dependencies |
| [login/vite.config.js](login/vite.config.js) | Port 3000 configuration |
| [admin/client/src/main.jsx](admin/client/src/main.jsx) | Admin app entry (redirects to login) |
| [student/client/src/main.jsx](student/client/src/main.jsx) | Student app entry |
| [package.json](package.json) | Root commands |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER (Browser)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │  Login Page      │
                    │ (localhost:3000) │
                    │  • Select Type   │
                    │  • Email/Pass    │
                    │  • Google Sign   │
                    └────┬────────┬────┘
                         │        │
              ┌──────────┘        └──────────┐
              │                              │
              ↓                              ↓
    ┌─────────────────────┐      ┌──────────────────────┐
    │  Admin Portal       │      │  Student Portal      │
    │ (localhost:3001)    │      │  (localhost:3002)    │
    │                     │      │                      │
    │ Frontend:           │      │ Frontend:            │
    │ - Question Manager  │      │ - Code IDE           │
    │ - User Manager      │      │ - Problem List       │
    │ - Submission View   │      │ - Submissions        │
    │                     │      │                      │
    │ Backend (4001)      │      │ Backend (5001)       │
    │ - /api/admin/*      │      │ - /api/student/*     │
    │ - /api/execute      │      │ - /api/execute       │
    └─────────────────────┘      └──────────────────────┘
```

---

**Last Updated**: December 22, 2025
**Status**: ✅ Production Ready
