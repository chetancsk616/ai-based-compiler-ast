# Changelog

All notable changes to AI Web Compiler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.1.0] - 2025-12-22

### 🆕 Added
- **AI Justification Override System** - Level-aware AI validation for fairer grading
  - Activates when tests pass but logic marks deducted
  - Restores marks for minor deviations based on difficulty level
  - Easy: ~40-50% override rate (forgiving)
  - Medium: ~15-20% override rate (balanced)
  - Hard: ~5-10% override rate (strict)
  - Full audit logging for transparency
  - Cannot override test failures or complexity mismatches
  - See [AI_JUSTIFICATION_OVERRIDE.md](./AI_JUSTIFICATION_OVERRIDE.md) for details

- **Admin Audit API Endpoints**
  - `GET /admin/api/ai-audit/stats` - Overall statistics
  - `GET /admin/api/ai-audit/logs` - Recent audit logs
  - `GET /admin/api/ai-audit/user/:userId` - User-specific logs
  - `GET /admin/api/ai-audit/question/:questionId` - Question-specific logs

- **Comprehensive Documentation**
  - Created [AI_JUSTIFICATION_OVERRIDE.md](./AI_JUSTIFICATION_OVERRIDE.md)
  - Updated [DOCUMENTATION.md](./DOCUMENTATION.md) with AI override section
  - Updated [LOGIC_EVALUATION_SYSTEM.md](./LOGIC_EVALUATION_SYSTEM.md)
  - Updated [DOCS_INDEX.md](./DOCS_INDEX.md) and [README.md](./README.md)

### 🔧 Changed
- Verdict engine (`verdictEngine.js`) now async to support AI validation
- Evaluation endpoint passes question/submission data for AI validation
- Verdict structure now includes `aiOverride` object when applicable

### 🛡️ Safety
- AI can ONLY restore marks, never reduce them
- AI cannot override test failures
- AI cannot override complexity mismatches
- AI cannot override disallowed patterns
- All decisions logged to audit trail

---

## [2.0.0] - 2025-12-20

### 🆕 Added
- Complete documentation reorganization
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Comprehensive 21KB guide
- [DOCS_INDEX.md](./DOCS_INDEX.md) - Navigation helper

### 🔧 Changed
- Removed 5 redundant login documentation files
- Consolidated all essential documentation into 10 core files
- Updated README with better structure and badges

---

## [1.5.0] - 2025-12-18

### 🐛 Fixed
- **Student Login Routing Issue**
  - Fixed URL flickering between `/student` and `/` on login/refresh
  - Replaced `window.location.pathname` with React Router hooks
  - Used `useLocation()` and `useNavigate()` for proper basename handling
  - All navigation now respects React Router basename configuration

### 📝 Documentation
- Updated [LOGIC_EVALUATION_SYSTEM.md](./LOGIC_EVALUATION_SYSTEM.md)
- Added FAQ section about intermediate variables

---

## [1.0.0] - 2025-12-01

### 🎉 Initial Release
- Unified authentication portal
- Student code editor with multi-language support
- Admin panel for question/user management
- AST-based evaluation system (28/28 tests passing)
- Firebase integration (Auth, RTDB, Firestore)
- Piston API for code execution
- Groq AI for code assistance

---

## Key Features by Version

### Version 2.1.0 (Latest)
✅ AI Justification Override System  
✅ Level-aware fair grading  
✅ Audit logging and statistics  

### Version 2.0.0
✅ Comprehensive documentation  
✅ Documentation index and navigation  

### Version 1.5.0
✅ Student routing fix  
✅ React Router integration  

### Version 1.0.0
✅ Core platform functionality  
✅ AST evaluation system  
✅ Firebase authentication  

---

**Status**: Production Ready ✅  
**Latest Version**: 2.1.0  
**Last Updated**: December 22, 2025
