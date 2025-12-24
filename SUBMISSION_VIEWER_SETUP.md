# Admin Submission Viewer Setup

## Overview
The admin panel can now view all student submissions stored in Firestore with filtering capabilities.

## Changes Made

### 1. Navigation Updates
Added navigation buttons to easily switch between admin sections:

#### QuestionManager.jsx
- Added "📊 View Submissions" button (routes to `/admin/submissions`)
- Added "👥 Manage Users" button (routes to `/admin/users`)

#### SubmissionViewer.jsx
- Added "📝 Questions" button (routes to `/admin/questions`)
- Added "👥 Users" button (routes to `/admin/users`)

#### UserManager.jsx
- Added "📝 Questions" button (routes to `/admin/questions`)
- Added "📊 Submissions" button (routes to `/admin/submissions`)

### 2. Firestore Integration in Student Server

#### Added Firebase Admin Initialization
- Imports `firebase-admin` package
- Initializes with service account from project root
- Creates `getFirestore()` helper function

#### Submission Saving
When a student submits code, the following data is saved to Firestore collection `submissions`:
```javascript
{
  userId: string,
  userEmail: string,
  questionId: number,
  questionTitle: string,
  language: string,
  code: string,
  score: number (0-100),
  decision: string ('PASS', 'FAIL', 'ERROR'),
  trustScore: number (0-100),
  testResults: {
    totalTests: number,
    passedTests: number,
    passRate: number
  },
  logicComparison: {
    algorithmMatch: boolean,
    complexityMatch: boolean,
    overallMatch: boolean
  },
  submittedAt: Timestamp,
  timestamp: ISO string,
  securityEvents: array
}
```

### 3. Admin API Endpoints (Already Implemented)

#### GET /api/admin/submissions
Fetches submissions with optional filters:
- `userId` - Filter by specific user
- `questionId` - Filter by specific question
- `minScore` - Minimum score threshold
- `maxScore` - Maximum score threshold
- `limit` - Number of results (default: 100)
- `offset` - Pagination offset

Returns:
```json
{
  "success": true,
  "total": 25,
  "submissions": [...]
}
```

#### GET /api/admin/submissions/:id
Fetches detailed information for a specific submission.

### 4. UI Features

#### Submission Viewer Page
- **Filters**: userId, questionId, minScore, maxScore
- **Table View**: Shows ID, User Email, Question Title, Language, Score, Date
- **Color-Coded Scores**:
  - Green (≥80%): High performance
  - Yellow (60-79%): Medium performance
  - Red (<60%): Needs improvement
- **View Details**: Click to see full submission with code syntax highlighting

## How to Access

1. **Login as Admin**: Use authorized admin email (srinivaschetan7@gmail.com)
2. **Navigate**: Click "📊 View Submissions" button from Question Manager
3. **Filter**: Use filters to narrow down submissions
4. **View Details**: Click "View" button on any submission

## Routes

- `/admin` or `/admin/questions` - Question Manager (default landing page)
- `/admin/submissions` - Submission Viewer
- `/admin/users` - User Manager

## Testing

To test the submission viewer:

1. **Start servers**:
   ```powershell
   # Terminal 1 - Admin Server (port 4100)
   cd admin/server
   node --watch index.js

   # Terminal 2 - Student Server (port 5001)
   cd student/server
   node --watch index.js

   # Terminal 3 - Admin Client (port 3005)
   cd admin/client
   npm run dev
   ```

2. **Submit code as student**:
   - Login to student portal (http://localhost:3004/student/)
   - Select a question
   - Write and submit code
   - Submission automatically saved to Firestore

3. **View submissions as admin**:
   - Login to admin panel (http://localhost:3005/admin/)
   - Click "📊 View Submissions"
   - Browse or filter submissions
   - Click "View" to see details

## Database Structure

### Firestore Collections

#### submissions (collection)
- Document ID: UUID v4 (submissionId)
- Fields: As listed in section 2 above

#### users/{userId}/questions/{questionId} (collection)
- Used for saving in-progress code
- Not for final submissions

## Security

- All admin endpoints protected by `requireAdmin` middleware
- Verifies Firebase ID token + email whitelist + custom claims
- Students cannot access admin APIs
- Admins can view all submissions across all users

## Future Enhancements

- Add export to CSV functionality
- Add submission comparison view
- Add statistics dashboard (already has /api/admin/stats endpoint)
- Add real-time submission notifications
- Add submission deletion/flagging
