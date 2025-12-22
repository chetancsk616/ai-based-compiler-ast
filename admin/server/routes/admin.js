// Admin API Routes
// Protected routes for admin panel operations

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { authenticateUser, requireAdmin, grantAdminAccess, revokeAdminAccess } = require('../middleware/adminAuth');

// Resolve question storage location (prefer admin/client/src/questions.json, fallback to student/client/src/questions.json)
const QUESTION_PATHS = [
  path.join(__dirname, '../../client/src/questions.json'),
  path.join(__dirname, '../../../student/client/src/questions.json'),
];

async function getQuestionsPath() {
  for (const candidate of QUESTION_PATHS) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch (err) {
      // continue to next candidate
    }
  }
  throw new Error('questions.json not found in expected locations');
}

async function readQuestions() {
  const questionsPath = await getQuestionsPath();
  const questionsData = await fs.readFile(questionsPath, 'utf8');
  const parsed = JSON.parse(questionsData);

  const normalized = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.questions)
      ? parsed.questions
      : [];

  const write = async (updatedQuestions) => {
    const payload = Array.isArray(parsed)
      ? updatedQuestions
      : { ...parsed, questions: updatedQuestions };

    await fs.writeFile(questionsPath, JSON.stringify(payload, null, 2));
  };

  return { questions: normalized, questionsPath, write };
}

// Apply authentication and admin middleware to all routes
router.use(authenticateUser);
router.use(requireAdmin);

// ============================================================================
// QUESTION MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/questions
 * Get all questions with filters
 */
router.get('/questions', async (req, res) => {
  try {
    const { search, difficulty, tag } = req.query;
    
    // Read questions from file
    const { questions: rawQuestions } = await readQuestions();
    let questions = rawQuestions.map((q) => ({
      ...q,
      requiresHiddenTests: q?.requiresHiddenTests !== false,
    }));
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(q => 
        q.title?.toLowerCase().includes(searchLower) ||
        q.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    if (tag) {
      questions = questions.filter(q => q.tags?.includes(tag));
    }
    
    res.json({ 
      success: true, 
      questions,
      total: questions.length 
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

/**
 * GET /api/admin/questions/:id
 * Get single question with reference logic
 */
router.get('/questions/:id', async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    
    // Read questions
    const { questions } = await readQuestions();
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      question.requiresHiddenTests = question?.requiresHiddenTests !== false;
    }
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Try to read reference logic if exists
    let referenceLogic = null;
    try {
      const logicPath = path.join(__dirname, `../logic/q${questionId}.json`);
      const logicData = await fs.readFile(logicPath, 'utf8');
      referenceLogic = JSON.parse(logicData);
    } catch (err) {
      // Reference logic doesn't exist yet
    }
    
    res.json({ 
      success: true, 
      question,
      referenceLogic 
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

/**
 * POST /api/admin/questions
 * Create new question
 */
router.post('/questions', async (req, res) => {
  try {
    const { title, description, difficulty, tags, testCases, referenceLogic } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    // Read existing questions
    const { questions, write } = await readQuestions();
    
    // Generate new ID
    const newId = questions.length > 0 
      ? Math.max(...questions.map(q => q.id)) + 1 
      : 1;
    
    // Create new question
    const newQuestion = {
      id: newId,
      title,
      description,
      difficulty: difficulty || 'Medium',
      tags: tags || [],
      testCases: testCases || [],
      requiresHiddenTests: req.body?.requiresHiddenTests !== false,
      createdAt: new Date().toISOString(),
      createdBy: req.user.email
    };
    
    questions.push(newQuestion);
    
    // Save questions
    await write(questions);
    
    // Save reference logic if provided
    if (referenceLogic) {
      const logicPath = path.join(__dirname, `../logic/q${newId}.json`);
      await fs.writeFile(logicPath, JSON.stringify(referenceLogic, null, 2));
    }
    
    res.json({ 
      success: true, 
      question: newQuestion,
      message: 'Question created successfully' 
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

/**
 * PUT /api/admin/questions/:id
 * Update existing question
 */
router.put('/questions/:id', async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    const { title, description, difficulty, tags, testCases, referenceLogic } = req.body;
    
    // Read questions
    const { questions, write } = await readQuestions();
    
    const questionIndex = questions.findIndex(q => q.id === questionId);
    
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Update question
    questions[questionIndex] = {
      ...questions[questionIndex],
      title: title || questions[questionIndex].title,
      description: description || questions[questionIndex].description,
      difficulty: difficulty || questions[questionIndex].difficulty,
      tags: tags !== undefined ? tags : questions[questionIndex].tags,
      testCases: testCases !== undefined ? testCases : questions[questionIndex].testCases,
      requiresHiddenTests:
        req.body?.requiresHiddenTests !== undefined
          ? req.body.requiresHiddenTests !== false
          : questions[questionIndex].requiresHiddenTests !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email
    };
    
    // Save questions
    await write(questions);
    
    // Update reference logic if provided
    if (referenceLogic) {
      const logicPath = path.join(__dirname, `../logic/q${questionId}.json`);
      await fs.writeFile(logicPath, JSON.stringify(referenceLogic, null, 2));
    }
    
    res.json({ 
      success: true, 
      question: questions[questionIndex],
      message: 'Question updated successfully' 
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

/**
 * DELETE /api/admin/questions/:id
 * Delete question
 */
router.delete('/questions/:id', async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    
    // Read questions
    const { questions, write } = await readQuestions();
    
    const questionIndex = questions.findIndex(q => q.id === questionId);
    
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Remove question
    questions.splice(questionIndex, 1);
    
    // Save questions
    await write(questions);
    
    // Try to delete reference logic if exists
    try {
      const logicPath = path.join(__dirname, `../logic/q${questionId}.json`);
      await fs.unlink(logicPath);
    } catch (err) {
      // File doesn't exist, ignore
    }
    
    res.json({ 
      success: true, 
      message: 'Question deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// ============================================================================
// SUBMISSION MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/submissions
 * Get all submissions with filters
 */
router.get('/submissions', async (req, res) => {
  try {
    const { userId, questionId, minScore, maxScore, limit = 100, offset = 0 } = req.query;
    
    // In a real app, this would query Firestore
    // For now, return mock data structure
    const submissions = {
      total: 0,
      submissions: [],
      message: 'Connect to Firestore to fetch actual submissions'
    };
    
    // TODO: Implement Firestore query
    // const snapshot = await admin.firestore()
    //   .collection('submissions')
    //   .limit(parseInt(limit))
    //   .offset(parseInt(offset))
    //   .get();
    
    res.json({ success: true, ...submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * GET /api/admin/submissions/:id
 * Get single submission with full details
 */
router.get('/submissions/:id', async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    // TODO: Implement Firestore fetch
    // const doc = await admin.firestore()
    //   .collection('submissions')
    //   .doc(submissionId)
    //   .get();
    
    res.json({ 
      success: true, 
      message: 'Connect to Firestore to fetch submission details' 
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/users', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    // Read users from file (fallback)
    const usersPath = path.join(__dirname, '../../client/users.json');
    const usersData = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(usersData);
    
    res.json({ 
      success: true, 
      users: users.slice(0, parseInt(limit)),
      total: users.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * POST /api/admin/users/:uid/grant-admin
 * Grant admin access to a user
 */
router.post('/users/:uid/grant-admin', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await grantAdminAccess(uid);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error granting admin access:', error);
    res.status(500).json({ error: 'Failed to grant admin access' });
  }
});

/**
 * POST /api/admin/users/:uid/revoke-admin
 * Revoke admin access from a user
 */
router.post('/users/:uid/revoke-admin', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await revokeAdminAccess(uid);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error revoking admin access:', error);
    res.status(500).json({ error: 'Failed to revoke admin access' });
  }
});

// ============================================================================
// ANALYTICS & STATISTICS
// ============================================================================

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Read questions count
    const { questions } = await readQuestions();
    
    // Read users count
    const usersPath = path.join(__dirname, '../../client/users.json');
    const usersData = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(usersData);
    
    const stats = {
      totalQuestions: questions.length,
      totalUsers: users.length,
      totalSubmissions: 0, // TODO: Query from Firestore
      averageScore: 0, // TODO: Calculate from submissions
      questionsByDifficulty: {
        Easy: questions.filter(q => q.difficulty === 'Easy').length,
        Medium: questions.filter(q => q.difficulty === 'Medium').length,
        Hard: questions.filter(q => q.difficulty === 'Hard').length
      },
      recentActivity: [] // TODO: Fetch recent submissions
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
