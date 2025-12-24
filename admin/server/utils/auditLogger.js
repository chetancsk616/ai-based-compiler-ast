/**
 * Audit Logger
 * 
 * Logs all AI override decisions for auditability and analysis
 * Stores logs in memory with optional file persistence
 */

const fs = require('fs').promises;
const path = require('path');

// In-memory audit log (last 1000 entries)
const auditLog = [];
const MAX_LOG_SIZE = 1000;

// Optional: Path to persistent log file
const LOG_FILE_PATH = path.join(__dirname, '../logs/ai-override-audit.jsonl');

/**
 * Log an AI override decision
 * @param {Object} logEntry - Log entry data
 */
async function logAIOverride(logEntry) {
  const timestamp = new Date().toISOString();
  
  const entry = {
    timestamp,
    submissionId: logEntry.submissionId,
    userId: logEntry.userId,
    userEmail: logEntry.userEmail,
    questionId: logEntry.questionId,
    questionTitle: logEntry.questionTitle,
    questionLevel: logEntry.questionLevel,
    initialScore: logEntry.initialScore,
    aiOverrideApplied: logEntry.aiOverrideApplied,
    finalScore: logEntry.finalScore,
    marksRestored: logEntry.marksRestored || 0,
    aiReason: logEntry.aiReason,
    aiDurationMs: logEntry.aiDurationMs,
    mismatchTypes: logEntry.mismatchTypes || [],
    testPassRate: logEntry.testPassRate,
    algorithmMatch: logEntry.algorithmMatch
  };
  
  // Add to in-memory log
  auditLog.push(entry);
  
  // Maintain max size
  if (auditLog.length > MAX_LOG_SIZE) {
    auditLog.shift();
  }
  
  // Log to console
  console.log('[Audit] AI Override:', {
    question: entry.questionId,
    level: entry.questionLevel,
    applied: entry.aiOverrideApplied,
    scoreChange: `${entry.initialScore} → ${entry.finalScore}`,
    reason: entry.aiReason?.substring(0, 80) + '...'
  });
  
  // Optional: Persist to file
  try {
    await ensureLogDirectory();
    await fs.appendFile(LOG_FILE_PATH, JSON.stringify(entry) + '\n', 'utf8');
  } catch (error) {
    console.warn('[Audit] Failed to write to log file:', error.message);
  }
}

/**
 * Get recent audit log entries
 * @param {Number} limit - Number of entries to retrieve
 * @returns {Array} Recent audit log entries
 */
function getRecentAuditLogs(limit = 100) {
  return auditLog.slice(-limit);
}

/**
 * Get audit statistics
 * @returns {Object} Audit statistics
 */
function getAuditStatistics() {
  if (auditLog.length === 0) {
    return {
      totalDecisions: 0,
      overridesApplied: 0,
      overridesRejected: 0,
      overrideRate: 0,
      averageMarksRestored: 0,
      byLevel: {}
    };
  }
  
  const totalDecisions = auditLog.length;
  const overridesApplied = auditLog.filter(e => e.aiOverrideApplied).length;
  const overridesRejected = totalDecisions - overridesApplied;
  
  const marksRestored = auditLog
    .filter(e => e.aiOverrideApplied)
    .map(e => e.marksRestored || 0);
  
  const averageMarksRestored = marksRestored.length > 0
    ? marksRestored.reduce((a, b) => a + b, 0) / marksRestored.length
    : 0;
  
  // Statistics by level
  const byLevel = {};
  ['easy', 'medium', 'hard'].forEach(level => {
    const levelEntries = auditLog.filter(e => e.questionLevel?.toLowerCase() === level);
    const levelOverrides = levelEntries.filter(e => e.aiOverrideApplied).length;
    
    byLevel[level] = {
      total: levelEntries.length,
      overridden: levelOverrides,
      rate: levelEntries.length > 0 ? (levelOverrides / levelEntries.length * 100).toFixed(1) + '%' : '0%'
    };
  });
  
  return {
    totalDecisions,
    overridesApplied,
    overridesRejected,
    overrideRate: (overridesApplied / totalDecisions * 100).toFixed(1) + '%',
    averageMarksRestored: averageMarksRestored.toFixed(1),
    byLevel
  };
}

/**
 * Get audit logs for a specific user
 * @param {String} userId - User ID
 * @returns {Array} User's audit log entries
 */
function getUserAuditLogs(userId) {
  return auditLog.filter(e => e.userId === userId);
}

/**
 * Get audit logs for a specific question
 * @param {String} questionId - Question ID
 * @returns {Array} Question's audit log entries
 */
function getQuestionAuditLogs(questionId) {
  return auditLog.filter(e => e.questionId === questionId);
}

/**
 * Ensure log directory exists
 */
async function ensureLogDirectory() {
  const logDir = path.dirname(LOG_FILE_PATH);
  try {
    await fs.access(logDir);
  } catch {
    await fs.mkdir(logDir, { recursive: true });
  }
}

/**
 * Clear in-memory audit log (for testing)
 */
function clearAuditLog() {
  auditLog.length = 0;
}

module.exports = {
  logAIOverride,
  getRecentAuditLogs,
  getAuditStatistics,
  getUserAuditLogs,
  getQuestionAuditLogs,
  clearAuditLog
};
