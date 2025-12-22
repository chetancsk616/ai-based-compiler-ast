# Login Page Quick Reference

## One-Command Startup

```bash
npm run dev
```

This starts:
- 🔐 **Login Page** on port 3000
- 👨‍💼 **Admin App** on port 3001 (with server on 4001)
- 👤 **Student App** on port 3002 (with server on 5001)

## URLs

| Service | URL |
|---------|-----|
| **Login** | http://localhost:3000 |
| **Admin** | http://localhost:3001 |
| **Student** | http://localhost:3002 |
| **Admin API** | http://localhost:4001/api |
| **Student API** | http://localhost:5001/api |

## Login Flow

```
┌─────────────────┐
│ Visit :3000     │
└────────┬────────┘
         │
┌────────▼────────┐
│ Select Type     │ ← Dropdown: Student or Admin
└────────┬────────┘
         │
┌────────▼────────┐
│ Enter Email     │
└────────┬────────┘
         │
┌────────▼────────┐
│ Enter Password  │
└────────┬────────┘
         │
┌────────▼────────────────┐
│ Click Login or           │
│ Google Sign-In           │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│ Firebase Authenticates  │
└────────┬────────────────┘
         │
         ├─ For Admin:
         │  └─ Check admin role
         │     └─ Redirect to :3001
         │
         └─ For Student:
            └─ Redirect to :3002
```

## Test Accounts

```
STUDENT LOGIN:
Email: student@test.com
Pass: password123

ADMIN LOGIN:
Email: admin@test.com
Pass: admin123
```

> ⚠️ These accounts won't work until configured in Firebase Console

## All Commands

```bash
# Run everything
npm run dev

# Run specific apps
npm run dev:login           # Login page only
npm run dev:admin           # Admin only
npm run dev:student         # Student only
npm run dev:admin-only      # Admin (alternate)
npm run dev:student-only    # Student (alternate)

# Build
npm run build              # Build all
npm run build:login        # Build login
npm run build:admin        # Build admin client
npm run build:student      # Build student client

# Install
npm run install:all        # Install all dependencies

# Production
npm run start              # Start production
```

## Files

| File | Purpose |
|------|---------|
| [login/src/Login.jsx](login/src/Login.jsx) | Main login component |
| [login/src/AuthContext.jsx](login/src/AuthContext.jsx) | Auth state |
| [login/.env](login/.env) | Firebase config |
| [LOGIN_SETUP.md](LOGIN_SETUP.md) | Full documentation |
| [START.md](START.md) | General quick start |

## Features

✅ Dropdown: Student vs Admin  
✅ Email/Password login  
✅ Google Sign-In  
✅ Admin role verification  
✅ Auto-redirect  
✅ Beautiful Tailwind UI  
✅ Error handling  

## Setup Steps

1. **Configure .env files**
   - Get Firebase credentials from Firebase Console
   - Set in `login/.env`, `admin/.env`, `student/.env`

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start**
   ```bash
   npm run dev
   ```

4. **Visit**
   ```
   http://localhost:3000
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `taskkill /F /IM node.exe` |
| Firebase not configured | Check `.env` files |
| Admin login fails | Set admin custom claim in Firebase |
| Can't login | Create account in Firebase Console first |
| Redirect not working | Check browser console for errors |

## Firebase Setup (Admin Role)

In Firebase Console:

1. Go to **Authentication** → **Users**
2. Click user email
3. Click **Custom claims**
4. Add:
   ```json
   {"role": "admin"}
   ```
5. Click **Save**

Now that user can login as admin!

---

**See [LOGIN_SETUP.md](LOGIN_SETUP.md) for complete documentation**
