/**
 * Test script for AI Justification Override System
 * Run with: node test-ai-override.js
 */

const path = require('path');
require('dotenv').config();

// Import the modules
const { validateLogicDeduction } = require('./admin/server/ai/aiJustificationValidator');
const { logAIOverride, getAuditStatistics } = require('./admin/server/utils/auditLogger');

// Test scenarios
const testScenarios = [
  {
    name: 'Easy Level - Extra Variable (Should Override)',
    input: {
      questionLevel: 'easy',
      questionTitle: 'Sum of Numbers',
      expectedLogicSummary: 'Basic Addition',
      algorithmMatch: 'PARTIAL',
      logicMismatchType: ['extra_variable'],
      detectedTimeComplexity: 'O(1)',
      expectedTimeComplexity: 'O(1)',
      detectedSpaceComplexity: 'O(1)',
      expectedSpaceComplexity: 'O(1)',
      testCasesPassed: true,
      testPassRate: 100,
      complexityMatched: true,
      timeComplexityMatch: true,
      spaceComplexityMatch: true,
      initialLogicDeduction: 8
    },
    expectedOverride: true
  },
  {
    name: 'Hard Level - Extra Variable (Should NOT Override)',
    input: {
      questionLevel: 'hard',
      questionTitle: 'Complex Algorithm',
      expectedLogicSummary: 'Advanced DP',
      algorithmMatch: 'PARTIAL',
      logicMismatchType: ['extra_variable'],
      detectedTimeComplexity: 'O(n)',
      expectedTimeComplexity: 'O(n)',
      detectedSpaceComplexity: 'O(1)',
      expectedSpaceComplexity: 'O(1)',
      testCasesPassed: true,
      testPassRate: 100,
      complexityMatched: true,
      timeComplexityMatch: true,
      spaceComplexityMatch: true,
      initialLogicDeduction: 10
    },
    expectedOverride: false
  },
  {
    name: 'Easy Level - Test Failed (Should NOT Override)',
    input: {
      questionLevel: 'easy',
      questionTitle: 'Sum of Numbers',
      expectedLogicSummary: 'Basic Addition',
      algorithmMatch: 'PARTIAL',
      logicMismatchType: ['extra_variable'],
      detectedTimeComplexity: 'O(1)',
      expectedTimeComplexity: 'O(1)',
      detectedSpaceComplexity: 'O(1)',
      expectedSpaceComplexity: 'O(1)',
      testCasesPassed: false, // Test failed
      testPassRate: 75,
      complexityMatched: true,
      timeComplexityMatch: true,
      spaceComplexityMatch: true,
      initialLogicDeduction: 8
    },
    expectedOverride: false
  },
  {
    name: 'Easy Level - Complexity Mismatch (Should NOT Override)',
    input: {
      questionLevel: 'easy',
      questionTitle: 'Binary Search',
      expectedLogicSummary: 'Binary Search',
      algorithmMatch: 'PARTIAL',
      logicMismatchType: ['wrong_loop_type'],
      detectedTimeComplexity: 'O(n)', // Wrong complexity
      expectedTimeComplexity: 'O(log n)',
      detectedSpaceComplexity: 'O(1)',
      expectedSpaceComplexity: 'O(1)',
      testCasesPassed: true,
      testPassRate: 100,
      complexityMatched: false, // Complexity mismatch
      timeComplexityMatch: false,
      spaceComplexityMatch: true,
      initialLogicDeduction: 15
    },
    expectedOverride: false
  },
  {
    name: 'Medium Level - Structural Variation (May Override)',
    input: {
      questionLevel: 'medium',
      questionTitle: 'Array Processing',
      expectedLogicSummary: 'Array Iteration',
      algorithmMatch: 'PARTIAL',
      logicMismatchType: ['structural_variation'],
      detectedTimeComplexity: 'O(n)',
      expectedTimeComplexity: 'O(n)',
      detectedSpaceComplexity: 'O(1)',
      expectedSpaceComplexity: 'O(1)',
      testCasesPassed: true,
      testPassRate: 100,
      complexityMatched: true,
      timeComplexityMatch: true,
      spaceComplexityMatch: true,
      initialLogicDeduction: 5
    },
    expectedOverride: null // AI decides
  }
];

async function runTests() {
  console.log('\n🧪 Testing AI Justification Override System\n');
  console.log('=' .repeat(80));
  
  let passedTests = 0;
  let failedTests = 0;
  let aiDecisionTests = 0;

  for (const scenario of testScenarios) {
    console.log(`\n📝 Test: ${scenario.name}`);
    console.log('-'.repeat(80));
    
    try {
      const result = await validateLogicDeduction(scenario.input);
      
      console.log(`AI Decision: ${result.overrideAllowed ? '✅ OVERRIDE' : '❌ NO OVERRIDE'}`);
      console.log(`Reason: ${result.reason}`);
      console.log(`Duration: ${result.durationMs}ms`);
      
      if (scenario.expectedOverride === null) {
        // AI decides - just check it returned valid response
        console.log(`Result: ⚖️  AI DECISION (no assertion)`);
        aiDecisionTests++;
      } else if (result.overrideAllowed === scenario.expectedOverride) {
        console.log(`Result: ✅ PASS`);
        passedTests++;
      } else {
        console.log(`Result: ❌ FAIL`);
        console.log(`Expected: ${scenario.expectedOverride ? 'Override' : 'No Override'}`);
        console.log(`Got: ${result.overrideAllowed ? 'Override' : 'No Override'}`);
        failedTests++;
      }

      // Test audit logging
      if (result.overrideAllowed) {
        logAIOverride({
          submissionId: `test_${Date.now()}`,
          userId: 'test_user',
          questionId: 'Q001',
          questionLevel: scenario.input.questionLevel,
          initialScore: 92,
          aiOverrideApplied: true,
          finalScore: 100,
          marksRestored: scenario.input.initialLogicDeduction,
          aiReason: result.reason,
          aiDurationMs: result.durationMs
        });
      }
      
    } catch (error) {
      console.log(`Result: ❌ ERROR`);
      console.error(`Error: ${error.message}`);
      failedTests++;
    }
  }

  // Show audit statistics
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Audit Statistics\n');
  const stats = getAuditStatistics();
  console.log('Total Decisions:', stats.totalDecisions);
  console.log('Overrides Applied:', stats.overridesApplied);
  console.log('Overrides Rejected:', stats.overridesRejected);
  console.log('Override Rate:', stats.overrideRate);
  if (stats.totalDecisions > 0) {
    console.log('\nBy Level:');
    console.log('  Easy:', stats.byLevel.easy);
    console.log('  Medium:', stats.byLevel.medium);
    console.log('  Hard:', stats.byLevel.hard);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n🎯 Test Summary\n');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`⚖️  AI Decisions: ${aiDecisionTests}`);
  console.log(`📊 Total: ${testScenarios.length}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed.\n');
    process.exit(1);
  }
}

// Check for GROQ_API_KEY
if (!process.env.GROQ_API_KEY) {
  console.error('\n❌ Error: GROQ_API_KEY not found in environment');
  console.error('Please set GROQ_API_KEY in your .env file or environment variables\n');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Fatal Error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
