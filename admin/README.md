# AI Compiler - Admin Panel

Independent admin project for managing the AI Web Compiler system.

## Features

- **Question Management**: Create, edit, and delete programming questions
- **User Management**: View and manage student accounts
- **Submission Viewer**: Review student code submissions and results
- **Firebase Integration**: Real-time database and authentication

## Project Structure

```
admin-project/
├── client/           # React frontend (Vite + React + TailwindCSS)
│   ├── src/
│   │   ├── AdminDashboard.jsx
│   │   ├── QuestionManager.jsx
│   │   ├── UserManager.jsx
│   │   └── SubmissionViewer.jsx
│   └── package.json
├── server/           # Express backend
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── index.js
├── package.json
└── .env
```

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Firebase account with Admin SDK credentials
- Groq API key (for AI features)

## Installation

1. **Clone or copy this project to your machine**

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials (base64 encoded service account JSON)
   - Add your Groq API key

4. **Set up Firebase**:
   - Go to Firebase Console
   - Create/select your project
   - Download service account JSON
   - Base64 encode it and add to `.env`

## Running the Application

### Development Mode (Both servers)
```bash
npm run dev
```
This runs both client (port 3001) and server (port 4001) concurrently.

### Run Client Only
```bash
npm run dev:client
```
Runs on http://localhost:3001

### Run Server Only
```bash
npm run dev:server
```
Runs on http://localhost:4001

### Production
```bash
# Build client
npm run build:client

# Start server
npm start
```

## Configuration

### Client (client/.env or import.meta.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:4001)
- `VITE_FIREBASE_CONFIG`: Firebase web config

### Server (.env in root)
- `PORT`: Server port (default: 4001)
- `API_PREFIX`: API route prefix (default: /api)
- `GROQ_API_KEY`: Your Groq API key
- `FIREBASE_SERVICE_ACCOUNT_BASE64`: Base64 encoded Firebase admin credentials

## API Endpoints

### Admin Routes
- `GET /api/admin/health` - Health check
- `GET /api/admin/questions` - List all questions
- `POST /api/admin/questions` - Create new question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/users` - List all users
- `GET /api/admin/submissions` - List submissions

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Firebase (Authentication)

### Backend
- Node.js + Express
- Firebase Admin SDK
- Groq AI API
- JWT Authentication
- AST-based code analysis

## Development

### Client Development
```bash
cd client
npm run dev
```

### Server Development
```bash
cd server
npm run dev
```

### Run Tests
```bash
cd server
npm test
```

## License

Private - For internal use only
