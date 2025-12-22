# Quick Start Guide

## 🚀 One Command to Start Everything

```bash
npm run dev
```

This command starts all four servers simultaneously:
- ✅ Admin Client → http://localhost:3001
- ✅ Admin Server → http://localhost:4001
- ✅ Student Client → http://localhost:3002
- ✅ Student Server → http://localhost:5001

## 📋 First Time Setup

### 1. Install Dependencies

```bash
npm run install:all
```

This installs all packages for both admin and student projects.

### 2. Configure Environment

Create `.env` files in both `admin/` and `student/` directories:

**admin/.env**
```env
PORT=4001
GROQ_API_KEY=your_groq_key_here
FIREBASE_SERVICE_ACCOUNT_BASE64=your_firebase_base64_here
AST_ENABLED=true
```

**student/.env**
```env
PORT=5001
GROQ_API_KEY=your_groq_key_here
FIREBASE_SERVICE_ACCOUNT_BASE64=your_firebase_base64_here
AST_ENABLED=true
PISTON_API_URL=https://emkc.org/api/v2/piston
```

### 3. Build Projects

```bash
npm run build
```

### 4. Start Development

```bash
npm run dev
```

## 🎮 Available Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start everything (admin + student) |
| `npm run dev:admin-only` | Start only admin panel |
| `npm run dev:student-only` | Start only student portal |

### Production

| Command | Description |
|---------|-------------|
| `npm run build` | Build both projects |
| `npm run build:admin` | Build admin only |
| `npm run build:student` | Build student only |
| `npm start` | Start production servers |

### Maintenance

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Admin Panel | http://localhost:3001 | Question management, user admin |
| Admin API | http://localhost:4001 | Backend for admin panel |
| Student Portal | http://localhost:3002 | Code editor, learning platform |
| Student API | http://localhost:5001 | Backend for student portal |

## 📂 Project Structure

```
ai-web-compiler/
├── admin/
│   ├── client/    → Vite dev server (3001)
│   └── server/    → Express server (4001)
└── student/
    ├── client/    → Vite dev server (3002)
    └── server/    → Express server (5001)
```

## 🔧 Configuration

### Firebase Setup

1. Go to Firebase Console
2. Create/select project
3. Download service account JSON
4. Base64 encode:
   ```bash
   # PowerShell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content serviceAccountKey.json -Raw)))
   ```
5. Add to `.env` files

### Groq API Setup

1. Visit https://console.groq.com
2. Generate API key
3. Add to `.env` files

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill all Node processes
taskkill /F /IM node.exe
```

### Build Failures

```bash
# Clean and reinstall
cd admin/client && rm -rf node_modules dist && npm install
cd ../../student/client && rm -rf node_modules dist && npm install
```

### Environment Issues

- ✅ Check `.env` files exist in `admin/` and `student/`
- ✅ Verify GROQ_API_KEY is set
- ✅ Verify FIREBASE_SERVICE_ACCOUNT_BASE64 is correct
- ✅ Ensure no trailing spaces in environment values

### Server Won't Start

```bash
# Check for syntax errors
cd admin/server && node index.js
cd ../../student/server && node index.js

# View detailed logs
npm run dev:admin-only  # Check admin logs
npm run dev:student-only  # Check student logs
```

## 📖 Next Steps

After starting the servers:

1. **Admin Panel** (http://localhost:3001)
   - Login with admin credentials
   - Manage questions
   - View submissions
   - Manage users

2. **Student Portal** (http://localhost:3002)
   - Sign up / Login
   - Browse questions
   - Write and test code
   - Get AI assistance

## 📚 Additional Documentation

- [README.md](README.md) - Complete project documentation
- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [API.md](API.md) - API documentation

## 💡 Tips

- Use `Ctrl+C` to stop servers
- All servers have hot-reload enabled
- Check browser console for frontend errors
- Check terminal for backend errors
- Firebase auth requires valid credentials

---

**Need Help?** Check the [README](README.md) or contact the system administrator.

**Last Updated**: December 22, 2025
