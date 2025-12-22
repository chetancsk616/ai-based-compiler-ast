const crypto = require('crypto');

// Simple seeded PRNG (mulberry32)
function createSeededRng(seedValue) {
  let seed = parseInt(
    crypto.createHash('sha256').update(String(seedValue)).digest('hex').slice(0, 8),
    16
  );

  return function rng() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addWhitespaceNoise(input, rng) {
  if (typeof input !== 'string') return input || '';

  const prefixSpaces = rng() > 0.7 ? ' '.repeat(Math.floor(rng() * 3)) : '';
  const suffixSpaces = rng() > 0.7 ? ' '.repeat(Math.floor(rng() * 3)) : '';
  const suffixNewlines = rng() > 0.5 ? '\n'.repeat(Math.floor(rng() * 2)) : '';

  return `${prefixSpaces}${input}${suffixSpaces}${suffixNewlines}`;
}

function normalizeTestCase(testCase = {}) {
  return {
    input: typeof testCase.input === 'string' ? testCase.input : '',
    expectedOutput:
      typeof testCase.expectedOutput === 'string'
        ? testCase.expectedOutput
        : String(testCase.expectedOutput ?? ''),
    description: testCase.description || 'Hidden auto-generated',
  };
}

function generateHiddenTestCases(referenceLogic, options = {}) {
  const {
    submissionId = '',
    maxHidden = 500,
    baseTestCases = [],
  } = options;

  if (referenceLogic?.requiresHiddenTests === false) {
    return [];
  }

  const pool = Array.isArray(baseTestCases)
    ? baseTestCases.filter((tc) => tc && typeof tc === 'object')
    : [];

  if (pool.length === 0) return [];

  const rng = createSeededRng(
    `${referenceLogic?.questionId || 'Q'}|${submissionId || 'default'}`
  );

  // Intelligent sizing based on difficulty and pool size
  const difficulty = referenceLogic?.difficulty?.toLowerCase() || 'medium';
  let intelligentTarget;
  
  if (difficulty === 'easy') {
    // Easy questions: 5-15 hidden tests
    intelligentTarget = Math.min(15, Math.max(5, pool.length * 3));
  } else if (difficulty === 'medium') {
    // Medium questions: 10-30 hidden tests
    intelligentTarget = Math.min(30, Math.max(10, pool.length * 5));
  } else {
    // Hard questions: 15-50 hidden tests
    intelligentTarget = Math.min(50, Math.max(15, pool.length * 7));
  }

  const target = Math.min(maxHidden, intelligentTarget);
  const hidden = [];

  console.info(
    `[HiddenTestGen] Generating ${target} hidden tests for ${referenceLogic?.questionId} (difficulty: ${difficulty}, base: ${pool.length})`
  );

  for (let i = 0; i < target; i++) {
    const template = normalizeTestCase(pool[Math.floor(rng() * pool.length)]);
    hidden.push({
      ...template,
      input: addWhitespaceNoise(template.input, rng),
      expectedOutput: template.expectedOutput,
      generated: true,
      source: 'hidden-fuzz',
    });
  }

  return hidden;
}

module.exports = {
  generateHiddenTestCases,
};