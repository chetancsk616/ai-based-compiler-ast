# AI Justification Override System

> **Level-Aware AI-Assisted Logic Deduction Override**  
> **Status**: Implemented ✅  
> **Version**: 1.0

---

## 📖 Overview

The AI Justification Override System is a post-processing validation layer that provides level-aware fairness in code evaluation. It activates **only** when logic marks are deducted despite all test cases passing, using AI to determine if the deduction should be waived based on question difficulty.

### Key Principles

✅ **AI can ONLY restore marks, never reduce them**  
✅ **Deterministic scoring is ALWAYS computed first**  
✅ **Cannot override test failures, complexity mismatches, or violations**  
✅ **Level-aware policies** (Easy/Medium/Hard)  
✅ **Full audit logging** for transparency  
✅ **Fail-safe design** - system works without AI

---

## 🎯 When AI Override Triggers

The system activates when ALL conditions are met:

1. ✅ **All test cases passed** (100% pass rate)
2. ✅ **Algorithm match is PARTIAL** (minor deviations detected)
3. ✅ **Score is 80-99** (near-perfect but not full marks)
4. ✅ **No complexity mismatches**
5. ✅ **No disallowed patterns**

**Example Scenario**:
```
Student Code:
a = int(input())
b = int(input())
c = a + b  # Extra variable
print(c)

Deterministic Score: 92/100
Reason: Extra variable (8 points deducted for efficiency)
AI Decision: For "Easy" level, this is acceptable → Restore to 100/100
```

---

## 🧠 Level-Aware Policies

### Easy Level (Most Forgiving)

**Override Allowed For**:
- Extra variables
- Redundant assignments
- Structural variations
- Alternate loop forms
- Verbose logic
- Non-optimal ordering

**Philosophy**: "If it works and complexity is right, give full marks"

### Medium Level (Balanced)

**Override Allowed For**:
- Extra variables (if no efficiency impact)
- Structural variations (if logic equivalent)
- Alternate loop forms (if no nesting issues)

**Conditions**:
- Logic must be semantically equivalent
- No efficiency degradation
- No unnecessary nested loops

**Philosophy**: "Balance correctness with efficiency awareness"

### Hard Level (Strict)

**Override Allowed For**:
- Trivial syntactic variations only

**Conditions**:
- Only minor rearrangements
- Efficiency and elegance expected

**Philosophy**: "Almost never override - high standards expected"

---

## 🔧 Implementation Details

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  EVALUATION PIPELINE                         │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  STAGE 1-4: Deterministic Evaluation                        │
│  • Load reference logic                                      │
│  • Extract AST features                                      │
│  • Compare logic                                             │
│  • Execute tests                                             │
│  ────────────────────────────────────────                   │
│  Initial Score: 92/100                                       │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  STAGE 5: Generate Verdict (with AI Override)               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Should trigger AI validation?                          │ │
│  │ ✓ Tests passed? YES                                    │ │
│  │ ✓ Algorithm PARTIAL? YES                               │ │
│  │ ✓ Score 80-99? YES (92)                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Call AI Validator                                      │ │
│  │ • Build structured input (NOT raw code)                │ │
│  │ • Apply level-aware policy                             │ │
│  │ • Get AI decision                                      │ │
│  │ • Validate against safety rules                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ AI Decision: Override Allowed                          │ │
│  │ Reason: "Extra variable acceptable for Easy level"     │ │
│  │ Action: Restore 8 marks                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  Final Score: 100/100                                       │
│  AI Override: Applied ✅                                     │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  AUDIT LOGGING                                               │
│  • Submission ID, User ID                                    │
│  • Original score → Final score                              │
│  • AI reason & duration                                      │
│  • Logged to file + in-memory                                │
└──────────────────────────────────────────────────────────────┘
```

### Files Created

1. **`admin/server/ai/aiJustificationValidator.js`**
   - Core AI validation logic
   - Level-aware policy enforcement
   - Safety rule validation
   - Groq AI integration

2. **`admin/server/utils/auditLogger.js`**
   - Audit log management
   - Statistics generation
   - In-memory storage (last 1000 entries)
   - Optional file persistence

3. **`student/server/ai/aiJustificationValidator.js`**
   - Copy of admin validator (for student submissions)

4. **`student/server/utils/auditLogger.js`**
   - Copy of admin audit logger

### Files Modified

1. **`admin/server/utils/verdictEngine.js`**
   - Integrated AI validation call
   - Added async support
   - Score restoration logic
   - Audit logging integration

2. **`admin/server/index.js`**
   - Pass question/submission data to verdict engine
   - Made evaluation async for AI call

3. **`admin/server/routes/admin.js`**
   - Added audit statistics endpoint
   - Added audit logs endpoints
   - User/question-specific audit queries

---

## 📊 API Endpoints

### View AI Override Statistics

```http
GET /admin/api/ai-audit/stats
Authorization: Bearer <firebase-admin-token>

Response:
{
  "success": true,
  "stats": {
    "totalDecisions": 150,
    "overridesApplied": 45,
    "overridesRejected": 105,
    "overrideRate": "30.0%",
    "averageMarksRestored": "6.2",
    "byLevel": {
      "easy": {
        "total": 80,
        "overridden": 35,
        "rate": "43.8%"
      },
      "medium": {
        "total": 50,
        "overridden": 8,
        "rate": "16.0%"
      },
      "hard": {
        "total": 20,
        "overridden": 2,
        "rate": "10.0%"
      }
    }
  }
}
```

### View Recent Audit Logs

```http
GET /admin/api/ai-audit/logs?limit=50
Authorization: Bearer <firebase-admin-token>

Response:
{
  "success": true,
  "logs": [
    {
      "timestamp": "2025-12-22T10:30:00.000Z",
      "submissionId": "sub_123",
      "userId": "user_456",
      "questionId": "Q002",
      "questionLevel": "easy",
      "initialScore": 92,
      "aiOverrideApplied": true,
      "finalScore": 100,
      "marksRestored": 8,
      "aiReason": "Extra variable acceptable for Easy level",
      "aiDurationMs": 245
    }
  ],
  "count": 50
}
```

### User-Specific Audit

```http
GET /admin/api/ai-audit/user/:userId
Authorization: Bearer <firebase-admin-token>

Response:
{
  "success": true,
  "userId": "user_456",
  "logs": [...],
  "count": 12
}
```

### Question-Specific Audit

```http
GET /admin/api/ai-audit/question/:questionId
Authorization: Bearer <firebase-admin-token>

Response:
{
  "success": true,
  "questionId": "Q002",
  "logs": [...],
  "count": 35
}
```

---

## 🔍 AI Input/Output Format

### Input to AI (Structured)

```javascript
{
  "questionLevel": "easy",
  "questionTitle": "Sum of Numbers",
  "expectedLogicSummary": "Basic Addition",
  "algorithmMatch": "PARTIAL",
  "logicMismatchType": ["extra_variable"],
  "detectedTimeComplexity": "O(1)",
  "expectedTimeComplexity": "O(1)",
  "detectedSpaceComplexity": "O(1)",
  "expectedSpaceComplexity": "O(1)",
  "testCasesPassed": true,
  "testPassRate": 100,
  "complexityMatched": true,
  "timeComplexityMatch": true,
  "spaceComplexityMatch": true,
  "initialLogicDeduction": 8
}
```

### AI Prompt (Generated)

```
You are an expert code evaluator assessing whether a logic deduction should be waived.

QUESTION DETAILS:
- Title: Sum of Numbers
- Difficulty: EASY
- Expected Algorithm: Basic Addition

EVALUATION RESULTS:
- Algorithm Match: PARTIAL
- Test Cases Passed: YES (100%)
- Time Complexity Match: YES
- Space Complexity Match: YES
- Logic Deduction Applied: 8 points

DETECTED ISSUES:
- Mismatch Types: extra_variable

LEVEL POLICY (EASY):
Easy level: Forgiving for style and minor deviations
- Allowed overrides: extra_variable, redundant_assignment, ...

YOUR TASK:
Determine if the logic deduction should be ignored...

RESPOND IN VALID JSON FORMAT ONLY:
{
  "overrideAllowed": true or false,
  "recommendedAction": "ignore_deduction" or "keep_deduction",
  "reason": "Brief explanation"
}
```

### AI Output (Expected)

```json
{
  "overrideAllowed": true,
  "recommendedAction": "ignore_deduction",
  "reason": "For Easy level questions, using an intermediate variable (c = a+b) is acceptable as it doesn't affect correctness or time complexity. The solution correctly computes the sum and passes all tests."
}
```

---

## 🛡️ Safety Rules

The system enforces strict safety rules to prevent inappropriate overrides:

### Pre-Validation Checks (Skip AI if these fail)

1. ❌ **Test cases must be 100% passed**
   - If any test fails, NO override possible
   - AI is not called

2. ❌ **Complexity must match**
   - Time complexity must match expected
   - Space complexity must match expected
   - AI is not called

### Post-AI Validation (Even if AI approves)

3. ❌ **Mismatch type must be in allowed list**
   - Check against level-specific policy
   - Reject if not in allowed list

4. ❌ **AI must explicitly approve**
   - `overrideAllowed` must be `true`
   - Reject if `false`

### What AI CANNOT Override

- ❌ Failed test cases
- ❌ Incorrect output
- ❌ Wrong time complexity (O(n) when O(log n) expected)
- ❌ Wrong space complexity
- ❌ Disallowed patterns (hardcoding, built-ins when forbidden)
- ❌ Syntax errors
- ❌ Runtime errors

---

## 📈 Performance

- **AI Call Duration**: ~200-300ms (p95)
- **Only triggers on**: 20-30% of submissions (those with PARTIAL match)
- **Override rate by level**:
  - Easy: ~40-50%
  - Medium: ~15-20%
  - Hard: ~5-10%
- **No performance impact** when AI not triggered

---

## 🧪 Testing

### Test Scenarios

**Scenario 1: Extra Variable (Easy Level)**
```python
# Expected
a = int(input())
b = int(input())
print(a + b)

# Student
a = int(input())
b = int(input())
c = a + b
print(c)

Result: Override ✅ (100/100)
Reason: Acceptable for Easy level
```

**Scenario 2: Wrong Complexity (Any Level)**
```python
# Expected: O(log n) binary search
# Student: O(n) linear search

Result: NO Override ❌
Reason: Complexity mismatch - safety rule
```

**Scenario 3: Failed Test (Any Level)**
```python
# Test output: Expected "8", Got "10"

Result: NO Override ❌
Reason: Test failure - safety rule
```

**Scenario 4: Medium Level Verbose Code**
```python
# Expected: Efficient DP
# Student: DP with extra temp variables

Result: Depends on AI ⚖️
AI will check if efficiency is impacted
```

---

## 📝 Configuration

### Environment Variables

No additional environment variables needed - uses existing `GROQ_API_KEY`.

### Disable AI Override (Optional)

To disable the AI override system:

```javascript
// In verdictEngine.js
const AI_OVERRIDE_ENABLED = false; // Set to false

if (AI_OVERRIDE_ENABLED && questionData && shouldTriggerAIValidation(...)) {
  // AI validation logic
}
```

### Adjust Trigger Thresholds

```javascript
// In aiJustificationValidator.js
function shouldTriggerAIValidation(verdictData) {
  const scoreInRange = finalScore >= 80 && finalScore < 100; // Adjust range
  // ...
}
```

---

## 🔬 Example Evaluation Flow

### Before AI Override

```json
{
  "decision": "ACCEPTABLE",
  "score": 92,
  "trustScore": 85,
  "components": {
    "ruleBased": {
      "algorithmMatch": "PARTIAL",
      "complexityMatch": true
    },
    "testResults": {
      "passRate": 100
    }
  },
  "issues": [
    {
      "source": "rule-based",
      "severity": "warning",
      "type": "efficiency",
      "description": "Extra variables detected"
    }
  ]
}
```

### After AI Override

```json
{
  "decision": "CORRECT",
  "score": 100,
  "trustScore": 90,
  "aiOverride": {
    "applied": true,
    "originalScore": 92,
    "marksRestored": 8,
    "reason": "Extra variable acceptable for Easy level",
    "durationMs": 245,
    "mismatchTypes": ["extra_variable"]
  },
  "components": {
    "ruleBased": {
      "algorithmMatch": "PARTIAL",
      "complexityMatch": true
    },
    "testResults": {
      "passRate": 100
    }
  },
  "issues": [
    {
      "source": "ai-justification",
      "severity": "info",
      "type": "override_applied",
      "description": "Minor deviations waived for easy level question"
    }
  ],
  "strengths": [
    {
      "source": "ai-justification",
      "severity": "info",
      "type": "marks_restored",
      "description": "AI validation: Extra variable acceptable for Easy level",
      "marksRestored": 8
    }
  ]
}
```

---

## 🎓 Educational Impact

### Benefits

1. **Fairer Grading**: Reduces over-penalization for style on Easy problems
2. **Encourages Learning**: Students focus on correctness first, optimization later
3. **Level-Appropriate**: Expectations match question difficulty
4. **Transparent**: Full audit trail of AI decisions
5. **Safe**: Cannot make grades worse, only better

### Statistics Expected

- **Easy Questions**: 40-50% override rate (more forgiving)
- **Medium Questions**: 15-20% override rate (balanced)
- **Hard Questions**: 5-10% override rate (strict)
- **Average Marks Restored**: 5-8 points per override

---

## 🚀 Future Enhancements

1. **Machine Learning**: Train model on historical overrides
2. **Pattern Recognition**: Identify common acceptable deviations
3. **Customizable Policies**: Per-instructor preferences
4. **Student Feedback**: Show AI reasoning to students
5. **A/B Testing**: Compare override vs no-override cohorts

---

## 📚 References

- [LOGIC_EVALUATION_SYSTEM.md](../LOGIC_EVALUATION_SYSTEM.md) - Core evaluation system
- [DOCUMENTATION.md](../DOCUMENTATION.md) - Complete system documentation
- [verdictEngine.js](../admin/server/utils/verdictEngine.js) - Implementation

---

**Status**: ✅ Production Ready  
**Last Updated**: December 22, 2025  
**Version**: 1.0
