# AI Compiler - Student Portal

Independent student project for the AI Web Compiler learning platform.

## Features

- **Code Editor**: Write and edit code in multiple languages (Python, JavaScript, Java, C++, C)
- **Real-time Compilation**: Execute code and see results instantly
- **AI Assistant**: Get help with errors and debugging using Groq AI
- **Problem Solving**: Access programming questions and submit solutions
- **Syntax Highlighting**: Enhanced code readability
- **Firebase Integration**: Authentication and data persistence

## Project Structure

```
student-project/
├── client/           # React frontend (Vite + React + TailwindCSS)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Editor.jsx
│   │   ├── QuestionList.jsx
│   │   └── components/
│   └── package.json
├── server/           # Express backend
│   ├── routes/
│   ├── executor/     # Piston API integration
│   ├── ai/          # Groq AI client
│   ├── ast/         # Code analysis
│   └── index.js
├── package.json
└── .env
```

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Firebase account with Admin SDK credentials
- Groq API key (for AI assistance)

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
This runs both client (port 3002) and server (port 5001) concurrently.

### Run Client Only
```bash
npm run dev:client
```
Runs on http://localhost:3002

### Run Server Only
```bash
npm run dev:server
```
Runs on http://localhost:5001

### Production
```bash
# Build client
npm run build:client

# Start server
npm start
```

## Configuration

### Client (client/.env or import.meta.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5001)
- `VITE_FIREBASE_CONFIG`: Firebase web config

### Server (.env in root)
- `PORT`: Server port (default: 5001)
- `API_PREFIX`: API route prefix (default: /api)
- `GROQ_API_KEY`: Your Groq API key
- `FIREBASE_SERVICE_ACCOUNT_BASE64`: Base64 encoded Firebase admin credentials
- `PISTON_API_URL`: Piston API endpoint for code execution

## API Endpoints

### Code Execution
- `POST /api/execute` - Execute code with Piston API
- `POST /api/execute-debug` - Execute with enhanced diagnostics

### AI Assistance
- `POST /api/ask-ai` - Get AI help with code/errors

### Questions
- `GET /api/questions` - List available questions
- `GET /api/questions/:id` - Get specific question

### Submissions
- `POST /api/submit` - Submit solution for evaluation
- `GET /api/submissions` - Get user submissions

## Supported Languages

- Python (3.x)
- JavaScript (Node.js)
- Java
- C++
- C

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- React Syntax Highlighter
- Firebase (Authentication)

### Backend
- Node.js + Express
- Firebase Admin SDK
- Groq AI API (Llama models)
- Piston API (Code execution)
- AST-based code analysis
- Esprima (JavaScript AST)

## Features in Detail

### Code Editor
- Multi-language support
- Syntax highlighting
- Line numbers
- Auto-indentation
- Tab support

### AI Assistant
- Error explanation
- Code suggestions
- Debugging help
- Learning tips

### Code Execution
- Sandboxed execution via Piston API
- Support for stdin input
- Capture stdout/stderr
- Exit code tracking

### Problem Solving
- Browse questions by difficulty
- Submit solutions
- Get instant feedback
- View submission history

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

Private - For educational use only
