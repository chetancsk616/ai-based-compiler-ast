/**
 * AI Justification Validator
 * 
 * Level-Aware AI Override System
 * - Activates ONLY when logic marks are deducted
 * - Can ONLY restore marks, never reduce them
 * - Cannot override test failures, complexity mismatches, or violations
 * - Decision is post-processing only, after deterministic scoring
 * 
 * CRITICAL RULES:
 * ❌ AI cannot reduce marks
 * ❌ AI cannot override failed test cases
 * ❌ AI cannot change time/space complexity results
 * ❌ AI cannot act on syntax or runtime errors
 * ✅ AI can only restore deducted logic marks
 * ✅ Deterministic score is always computed first
 * ✅ AI decision is post-processing only
 */

const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Level-aware override policy configuration
 */
const OVERRIDE_POLICIES = {
  easy: {
    allowOverrideFor: [
      'extra_variable',
      'redundant_assignment',
      'structural_variation',
      'alternate_loop_form',
      'verbose_logic',
      'non_optimal_ordering'
    ],
    description: 'Easy level: Forgiving for style and minor deviations'
  },
  medium: {
    allowOverrideFor: [
      'extra_variable',
      'structural_variation',
      'alternate_loop_form'
    ],
    conditions: [
      'Logic must be equivalent',
      'No efficiency impact',
      'No unnecessary nested loops'
    ],
    description: 'Medium level: Balanced - requires efficiency awareness'
  },
  hard: {
    allowOverrideFor: [
      'trivial_syntactic_variation'
    ],
    conditions: [
      'Only trivial syntactic rearrangements',
      'Efficiency and elegance expected'
    ],
    description: 'Hard level: Strict - almost never override'
  }
};

/**
 * Build structured input for AI validation
 * @param {Object} params - Validation parameters
 * @returns {Object} Structured input for AI
 */
function buildAIValidationInput({
  questionLevel,
  questionTitle,
  expectedAlgorithm,
  detectedIssues,
  detectedWarnings,
  timeComplexityMatch,
  spaceComplexityMatch,
  expectedTimeComplexity,
  detectedTimeComplexity,
  expectedSpaceComplexity,
  detectedSpaceComplexity,
  testCasesPassed,
  testPassRate,
  logicDeduction,
  algorithmMatch
}) {
  // Classify mismatch types from issues and warnings
  const mismatchTypes = [];
  
  if (detectedIssues) {
    detectedIssues.forEach(issue => {
      if (issue.type === 'partial_algorithm_match') mismatchTypes.push('structural_variation');
      if (issue.message && issue.message.includes('variable')) mismatchTypes.push('extra_variable');
      if (issue.message && issue.message.includes('loop')) mismatchTypes.push('alternate_loop_form');
      if (issue.message && issue.message.includes('order')) mismatchTypes.push('non_optimal_ordering');
    });
  }
  
  if (detectedWarnings) {
    detectedWarnings.forEach(warning => {
      if (warning.message && warning.message.includes('verbose')) mismatchTypes.push('verbose_logic');
      if (warning.message && warning.message.includes('redundant')) mismatchTypes.push('redundant_computation');
    });
  }

  return {
    questionLevel: questionLevel.toLowerCase(),
    questionTitle,
    expectedLogicSummary: expectedAlgorithm || 'Expected algorithm approach',
    algorithmMatch: algorithmMatch || 'PARTIAL',
    logicMismatchType: mismatchTypes.length > 0 ? mismatchTypes : ['structural_variation'],
    detectedTimeComplexity,
    expectedTimeComplexity,
    detectedSpaceComplexity,
    expectedSpaceComplexity,
    testCasesPassed: testPassRate === 100,
    testPassRate,
    complexityMatched: timeComplexityMatch && spaceComplexityMatch,
    timeComplexityMatch,
    spaceComplexityMatch,
    initialLogicDeduction: logicDeduction
  };
}

/**
 * Build AI prompt from structured input
 * @param {Object} input - Structured validation input
 * @returns {String} AI prompt
 */
function buildAIPrompt(input) {
  const policy = OVERRIDE_POLICIES[input.questionLevel] || OVERRIDE_POLICIES.medium;
  
  return `You are an expert code evaluator assessing whether a logic deduction in a student's code submission should be waived.

**QUESTION DETAILS:**
- Title: ${input.questionTitle}
- Difficulty: ${input.questionLevel.toUpperCase()}
- Expected Algorithm: ${input.expectedLogicSummary}

**EVALUATION RESULTS:**
- Algorithm Match: ${input.algorithmMatch}
- Test Cases Passed: ${input.testCasesPassed ? 'YES' : 'NO'} (${input.testPassRate}%)
- Time Complexity Match: ${input.timeComplexityMatch ? 'YES' : 'NO'} (Expected: ${input.expectedTimeComplexity}, Detected: ${input.detectedTimeComplexity})
- Space Complexity Match: ${input.spaceComplexityMatch ? 'YES' : 'NO'} (Expected: ${input.expectedSpaceComplexity}, Detected: ${input.detectedSpaceComplexity})
- Logic Deduction Applied: ${input.initialLogicDeduction} points

**DETECTED ISSUES:**
- Mismatch Types: ${input.logicMismatchType.join(', ')}

**LEVEL POLICY (${input.questionLevel.toUpperCase()}):**
${policy.description}
- Allowed overrides: ${policy.allowOverrideFor.join(', ')}
${policy.conditions ? '\n- Conditions: ' + policy.conditions.join('; ') : ''}

**YOUR TASK:**
Determine if the logic deduction should be ignored (marks restored) based on:
1. Does the mismatch affect correctness? (already verified: tests ${input.testCasesPassed ? 'passed' : 'failed'})
2. Does the mismatch affect time complexity? (${input.timeComplexityMatch ? 'no' : 'yes'})
3. Does the mismatch affect space complexity? (${input.spaceComplexityMatch ? 'no' : 'yes'})
4. Based on difficulty level, should this be ignored?

**CRITICAL RULES:**
- If test cases FAILED: NEVER override (return overrideAllowed: false)
- If complexity MISMATCHED: NEVER override (return overrideAllowed: false)
- If mismatch type NOT in allowed list for this level: NEVER override
- Only override for MINOR structural variations that don't affect correctness or efficiency

**RESPOND IN VALID JSON FORMAT ONLY:**
{
  "overrideAllowed": true or false,
  "recommendedAction": "ignore_deduction" or "keep_deduction",
  "reason": "Brief explanation (2-4 sentences max)"
}`;
}

/**
 * Parse AI response and validate format
 * @param {String} response - AI response text
 * @returns {Object|null} Parsed response or null if invalid
 */
function parseAIResponse(response) {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    const parsed = JSON.parse(jsonText);
    
    // Validate required fields
    if (
      typeof parsed.overrideAllowed !== 'boolean' ||
      !['ignore_deduction', 'keep_deduction'].includes(parsed.recommendedAction) ||
      typeof parsed.reason !== 'string'
    ) {
      console.warn('[AI Validator] Invalid response format:', parsed);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('[AI Validator] Failed to parse AI response:', error.message);
    return null;
  }
}

/**
 * Validate AI override against safety rules
 * @param {Object} aiDecision - AI decision object
 * @param {Object} input - Original validation input
 * @returns {Boolean} Whether override is safe to apply
 */
function validateAIOverride(aiDecision, input) {
  // Safety checks - these MUST pass
  
  // 1. Test cases must have passed
  if (!input.testCasesPassed) {
    console.log('[AI Validator] BLOCKED: Test cases not fully passed');
    return false;
  }
  
  // 2. Complexity must match
  if (!input.complexityMatched) {
    console.log('[AI Validator] BLOCKED: Complexity mismatch detected');
    return false;
  }
  
  // 3. AI must have approved
  if (!aiDecision.overrideAllowed) {
    console.log('[AI Validator] AI decision: Keep deduction');
    return false;
  }
  
  // 4. Check if mismatch types are allowed for this level
  const policy = OVERRIDE_POLICIES[input.questionLevel] || OVERRIDE_POLICIES.medium;
  const hasAllowedMismatch = input.logicMismatchType.some(type => 
    policy.allowOverrideFor.includes(type)
  );
  
  if (!hasAllowedMismatch) {
    console.log('[AI Validator] BLOCKED: Mismatch type not allowed for level:', input.questionLevel);
    return false;
  }
  
  return true;
}

/**
 * Call AI to validate if logic deduction should be overridden
 * @param {Object} params - Validation parameters
 * @returns {Promise<Object>} Override decision
 */
async function validateLogicDeduction(params) {
  const startTime = Date.now();
  
  try {
    // Build structured input
    const input = buildAIValidationInput(params);
    
    console.log('[AI Validator] Validating logic deduction:', {
      question: input.questionTitle,
      level: input.questionLevel,
      deduction: input.initialLogicDeduction,
      testsPassed: input.testCasesPassed,
      complexityMatch: input.complexityMatched
    });
    
    // Pre-validation checks - don't call AI if these fail
    if (!input.testCasesPassed) {
      console.log('[AI Validator] Pre-check FAILED: Tests not passed - skipping AI');
      return {
        overrideApplied: false,
        overrideAllowed: false,
        reason: 'Test cases failed - no override possible',
        aiCalled: false,
        durationMs: Date.now() - startTime
      };
    }
    
    if (!input.complexityMatched) {
      console.log('[AI Validator] Pre-check FAILED: Complexity mismatch - skipping AI');
      return {
        overrideApplied: false,
        overrideAllowed: false,
        reason: 'Complexity mismatch - no override possible',
        aiCalled: false,
        durationMs: Date.now() - startTime
      };
    }
    
    // Build prompt and call AI
    const prompt = buildAIPrompt(input);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a code evaluation expert. Respond only with valid JSON as specified.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Low temperature for consistency
      max_tokens: 500,
    });
    
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }
    
    // Parse and validate response
    const aiDecision = parseAIResponse(aiResponse);
    
    if (!aiDecision) {
      return {
        overrideApplied: false,
        overrideAllowed: false,
        reason: 'AI response parsing failed',
        aiCalled: true,
        durationMs: Date.now() - startTime
      };
    }
    
    // Validate against safety rules
    const isSafe = validateAIOverride(aiDecision, input);
    
    const result = {
      overrideApplied: isSafe && aiDecision.overrideAllowed,
      overrideAllowed: aiDecision.overrideAllowed,
      recommendedAction: aiDecision.recommendedAction,
      reason: aiDecision.reason,
      aiCalled: true,
      durationMs: Date.now() - startTime,
      input: {
        level: input.questionLevel,
        deduction: input.initialLogicDeduction,
        mismatchTypes: input.logicMismatchType
      }
    };
    
    console.log('[AI Validator] Decision:', {
      overrideApplied: result.overrideApplied,
      reason: result.reason,
      duration: result.durationMs + 'ms'
    });
    
    return result;
    
  } catch (error) {
    console.error('[AI Validator] Error:', error.message);
    
    // On error, fail safely - don't override
    return {
      overrideApplied: false,
      overrideAllowed: false,
      reason: 'AI validation error: ' + error.message,
      aiCalled: true,
      error: error.message,
      durationMs: Date.now() - startTime
    };
  }
}

/**
 * Check if AI validation should be triggered
 * @param {Object} verdictData - Verdict data before AI validation
 * @returns {Boolean} Whether to trigger AI validation
 */
function shouldTriggerAIValidation(verdictData) {
  const {
    ruleVerdictData,
    testVerdictData,
    finalScore
  } = verdictData;
  
  // Only trigger if:
  // 1. Test cases passed
  // 2. Algorithm match is PARTIAL (indicates deduction applied)
  // 3. Score is below 100 but above threshold
  
  const testsPassed = testVerdictData?.passRate === 100;
  const algorithmPartial = ruleVerdictData?.algorithmMatch === 'PARTIAL';
  const scoreInRange = finalScore >= 80 && finalScore < 100; // Only for near-perfect scores
  
  return testsPassed && algorithmPartial && scoreInRange;
}

module.exports = {
  validateLogicDeduction,
  shouldTriggerAIValidation,
  OVERRIDE_POLICIES
};
