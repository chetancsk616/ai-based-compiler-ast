# AI Web Compiler

A comprehensive web-based code compiler and learning platform with AI-powered assistance, featuring separate admin and student portals.

## 🌟 Features

### Student Portal
- **Multi-Language Code Editor** - Python, JavaScript, Java, C++, C
- **Real-time Code Execution** - Powered by Piston API
- **AI Assistant** - Groq AI for debugging and learning help
- **Problem Solving** - Access curated programming questions
- **Syntax Highlighting** - Enhanced code readability
- **Firebase Authentication** - Secure user management

### Admin Panel
- **Question Management** - Create, edit, delete questions
- **User Management** - View and manage student accounts
- **Submission Viewer** - Review student submissions
- **Real-time Dashboard** - Track system statistics
- **Admin Authentication** - Secure admin-only access

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Firebase account with Admin SDK
- Groq API key

### Installation

```bash
# Install all dependencies
npm run install:all

# Configure environment variables (see Configuration section)

# Build projects
npm run build

# Start everything
npm run dev
```

Access the applications:
- **Admin Panel**: http://localhost:3001
- **Student Portal**: http://localhost:3002

## 📁 Project Structure

```
ai-web-compiler/
├── admin/                          # Admin Panel Project
│   ├── client/                     # React frontend (port 3001)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── QuestionManager.jsx
│   │   │   ├── UserManager.jsx
│   │   │   ├── SubmissionViewer.jsx
│   │   │   └── AuthContext.jsx
│   │   └── package.json
│   ├── server/                     # Express backend (port 4001)
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── ai/
│   │   ├── ast/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── student/                        # Student Portal Project
│   ├── client/                     # React frontend (port 3002)
│   ├── server/                     # Express backend (port 5001)
│   ├── package.json
│   └── .env
│
├── package.json                    # Root commands
├── README.md                       # This file
└── START.md                        # Quick start guide
```

## ⚙️ Configuration

### Environment Variables

Both `admin/.env` and `student/.env` files are required:

```env
# Server Configuration
PORT=4001                           # Admin: 4001, Student: 5001
API_PREFIX=/api
NODE_ENV=development

# AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration (Base64 encoded)
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_credentials

# AST Configuration
AST_ENABLED=true

# Code Execution
PISTON_API_URL=https://emkc.org/api/v2/piston
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create/select your project
3. Navigate to Project Settings > Service Accounts
4. Generate new private key (downloads JSON)
5. Base64 encode and add to `.env`

### Groq AI Setup

1. Sign up at [Groq Console](https://console.groq.com)
2. Generate API key
3. Add to `.env` as `GROQ_API_KEY`

## 🎮 Usage

### Development Commands

```bash
# Start everything (admin + student)
npm run dev

# Start only admin panel
npm run dev:admin-only

# Start only student portal
npm run dev:student-only

# Install all dependencies
npm run install:all

# Build both projects
npm run build
```

### Production Commands

```bash
# Build for production
npm run build

# Start production servers
npm start
```

## 📚 API Documentation

### Admin API (Port 4001)

**Authentication Required** - All endpoints require admin JWT token

- `GET /api/admin/questions` - List all questions
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/users` - List all users
- `GET /api/admin/submissions` - List submissions
- `GET /api/admin/stats` - System statistics

### Student API (Port 5001)

- `POST /api/execute` - Execute code
- `POST /api/ask-ai` - Get AI assistance
- `GET /api/questions` - List questions
- `POST /api/submit` - Submit solution
- `GET /api/submissions` - User submissions

## 🔧 Tech Stack

### Frontend
- React 18, Vite, TailwindCSS
- React Router, Axios
- Firebase Authentication
- Syntax Highlighting

### Backend
- Node.js, Express
- Firebase Admin SDK
- Groq AI (Llama models)
- Piston API (code execution)
- AST-based code analysis

## 🛡️ Security

- Firebase Authentication
- JWT Tokens
- Admin Role Verification
- Rate Limiting
- Sandboxed Code Execution

## 🐛 Troubleshooting

**Port Already in Use**
```bash
# Windows: Check and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Firebase Connection Error**
- Verify `FIREBASE_SERVICE_ACCOUNT_BASE64` is set correctly
- Check Firebase project permissions

**Build Errors**
```bash
# Clean and reinstall
cd admin/client && rm -rf node_modules dist && npm install
cd ../../student/client && rm -rf node_modules dist && npm install
```

## 📖 Additional Documentation

- [START.md](START.md) - Quick start guide
- [admin/README.md](admin/README.md) - Admin documentation
- [student/README.md](student/README.md) - Student documentation

## 📄 License

Private - For educational use only

---

**Version**: 1.0.0  
**Last Updated**: December 22, 2025
