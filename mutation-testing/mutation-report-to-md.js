#!/usr/bin/env node

/**
 * Comprehensive Mutation Testing Report Generator
 * 
 * This script transforms Stryker's raw JSON mutation testing reports into comprehensive,
 * actionable markdown reports that developers can easily understand and act upon.
 * 
 * Key Features:
 * - Executive summary with risk assessment and clear recommendations
 * - Priority-based action items (High/Medium/Low) for systematic improvement
 * - Detailed analysis by mutator type with educational explanations
 * - File-by-file breakdown highlighting specific areas needing attention
 * - Educational appendix explaining mutation testing concepts and best practices
 * - Comprehensive statistical analysis and trend identification
 * - Pretty-printed JSON generation for detailed debugging and analysis
 * 
 * The script creates two outputs:
 * 1. mutation-report.md - A comprehensive, standalone report for developers
 * 2. mutation-report-pretty.json - Human-readable version of the raw JSON data
 * 
 * Usage: node mutation-report-to-md.js
 * 
 * Dependencies: Node.js built-in modules (fs, path)
 * Input: mutation-testing/reports/mutation-report.json (from Stryker)
 * Output: mutation-testing/reports/mutation-report.md & mutation-report-pretty.json
 */
const fs = require('fs');
const path = require('path');

function generateMarkdownReport() {
  const jsonPath = path.join(__dirname, '/reports/mutation-report.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('No mutation report found at:', jsonPath);
    return;
  }

      // Read the JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const report = JSON.parse(jsonData);
    
    // Create a pretty-printed version of the JSON for better human readability
    const prettyJsonPath = jsonPath.replace('.json', '-pretty.json');
    const prettyJsonData = JSON.stringify(report, null, 2);
    fs.writeFileSync(prettyJsonPath, prettyJsonData);
    console.log(`Pretty-printed JSON created at: ${prettyJsonPath}`);
  
  // Calculate overall metrics
  const overallStats = calculateOverallStats(report);
  
  let markdown = generateHeader(report, overallStats);
  markdown += generateExecutiveSummary(overallStats);
  markdown += generatePriorityActions(report);
  markdown += generateDetailedAnalysis(report);
  markdown += generateFileBreakdown(report);
  markdown += generateAppendix();

  // Write markdown file
  const mdPath = path.join(__dirname, '/reports/mutation-report.md');
  fs.writeFileSync(mdPath, markdown);
  console.log('Comprehensive mutation report generated at:', mdPath);
}

function calculateOverallStats(report) {
  let totalMutants = 0;
  let killedMutants = 0;
  let survivedMutants = 0;
  let noCoverageMutants = 0;
  let timeoutMutants = 0;
  let errorMutants = 0;
  const mutatorStats = {};
  const survivalReasons = {};

  Object.entries(report.files).forEach(([, fileData]) => {
    fileData.mutants.forEach(mutant => {
      totalMutants++;
      
      // Track mutator usage
      if (!mutatorStats[mutant.mutatorName]) {
        mutatorStats[mutant.mutatorName] = { total: 0, killed: 0, survived: 0, noCoverage: 0 };
      }
      mutatorStats[mutant.mutatorName].total++;
      
      switch (mutant.status) {
        case 'Killed':
          killedMutants++;
          mutatorStats[mutant.mutatorName].killed++;
          break;
        case 'Survived':
          survivedMutants++;
          mutatorStats[mutant.mutatorName].survived++;
          if (mutant.statusReason) {
            const key = extractTestFailureType(mutant.statusReason);
            survivalReasons[key] = (survivalReasons[key] || 0) + 1;
          }
          break;
        case 'NoCoverage':
          noCoverageMutants++;
          mutatorStats[mutant.mutatorName].noCoverage++;
          break;
        case 'Timeout':
          timeoutMutants++;
          break;
        case 'Error':
          errorMutants++;
          break;
      }
    });
  });

  const mutationScore = totalMutants > 0 ? ((killedMutants / (totalMutants - noCoverageMutants)) * 100) : 0;
  const coverageScore = totalMutants > 0 ? (((totalMutants - noCoverageMutants) / totalMutants) * 100) : 0;

  return {
    totalMutants,
    killedMutants,
    survivedMutants,
    noCoverageMutants,
    timeoutMutants,
    errorMutants,
    mutationScore,
    coverageScore,
    mutatorStats,
    survivalReasons
  };
}

function extractTestFailureType(statusReason) {
  if (!statusReason) return 'Unknown';
  if (statusReason.includes('TypeError')) return 'Type Error';
  if (statusReason.includes('ReferenceError')) return 'Reference Error';
  if (statusReason.includes('expect(received).toBe(expected)')) return 'Assertion Failure';
  if (statusReason.includes('timeout')) return 'Timeout';
  return 'Other Test Failure';
}

function generateHeader(report, stats) {
  const timestamp = new Date().toISOString();
  const scoreColor = stats.mutationScore >= 60 ? '🟢' : stats.mutationScore >= 50 ? '🟡' : '🔴';
  
  return `# 🧬 Mutation Testing Report

> **Generated:** ${timestamp}  
> **Mutation Score:** ${scoreColor} **${stats.mutationScore.toFixed(1)}%**  
> **Coverage Score:** ${stats.coverageScore.toFixed(1)}%  
> **Total Files Analyzed:** ${Object.keys(report.files).length}

> 💡 **Note:** A human-readable, pretty-printed version of the raw JSON data (that was used to produce this md file here) is available at \`mutation-report-pretty.json\` for detailed analysis and debugging.

---

`;
}

function generateExecutiveSummary(stats) {
  const riskLevel = stats.mutationScore >= 60 ? 'LOW' : stats.mutationScore >= 50 ? 'MEDIUM' : 'HIGH';
  const riskEmoji = stats.mutationScore >= 60 ? '✅' : stats.mutationScore >= 50 ? '⚠️' : '❌';
  
  return `## 📊 Executive Summary

${riskEmoji} **Risk Level: ${riskLevel}**

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Mutants** | ${stats.totalMutants} | 100% |
| **✅ Killed (Good)** | ${stats.killedMutants} | ${((stats.killedMutants / stats.totalMutants) * 100).toFixed(1)}% |
| **❌ Survived (Bad)** | ${stats.survivedMutants} | ${((stats.survivedMutants / stats.totalMutants) * 100).toFixed(1)}% |
| **🚫 No Coverage** | ${stats.noCoverageMutants} | ${((stats.noCoverageMutants / stats.totalMutants) * 100).toFixed(1)}% |
| **⏱️ Timeout** | ${stats.timeoutMutants} | ${((stats.timeoutMutants / stats.totalMutants) * 100).toFixed(1)}% |
| **💥 Error** | ${stats.errorMutants} | ${((stats.errorMutants / stats.totalMutants) * 100).toFixed(1)}% |

### Quality Assessment
- **Mutation Score:** ${stats.mutationScore.toFixed(1)}% ${stats.mutationScore >= 80 ? '(Excellent)' : stats.mutationScore >= 60 ? '(Good)' : '(Needs Improvement)'}
- **Test Coverage:** ${stats.coverageScore.toFixed(1)}% ${stats.coverageScore >= 90 ? '(Excellent)' : stats.coverageScore >= 70 ? '(Good)' : '(Poor)'}

---

`;
}

function generatePriorityActions(report) {
  const fileIssues = [];
  
  Object.entries(report.files).forEach(([filePath, fileData]) => {
    const totalMutants = fileData.mutants.length;
    const noCoverageMutants = fileData.mutants.filter(m => m.status === 'NoCoverage').length;
    const survivedMutants = fileData.mutants.filter(m => m.status === 'Survived').length;
    const killedMutants = fileData.mutants.filter(m => m.status === 'Killed').length;
    
    const coverage = totalMutants > 0 ? ((totalMutants - noCoverageMutants) / totalMutants) * 100 : 0;
    const mutationScore = (totalMutants - noCoverageMutants) > 0 ? (killedMutants / (totalMutants - noCoverageMutants)) * 100 : 0;
    
    fileIssues.push({
      filePath,
      coverage,
      mutationScore,
      survivedMutants,
      noCoverageMutants,
      totalMutants,
      priority: calculatePriority(coverage, mutationScore, survivedMutants)
    });
  });
  
  // Sort by priority (higher is more urgent)
  fileIssues.sort((a, b) => b.priority - a.priority);
  
  let markdown = `## 🎯 Priority Actions

### Immediate Actions Required:

`;

  const highPriorityFiles = fileIssues.filter(f => f.priority >= 8);
  const mediumPriorityFiles = fileIssues.filter(f => f.priority >= 5 && f.priority < 8);
  const lowPriorityFiles = fileIssues.filter(f => f.priority < 5);

  if (highPriorityFiles.length > 0) {
    markdown += `#### 🔴 HIGH PRIORITY (Immediate attention needed)\n\n`;
    highPriorityFiles.slice(0, 5).forEach(file => {
      markdown += generateFileActionItem(file);
    });
  }

  if (mediumPriorityFiles.length > 0) {
    markdown += `#### 🟡 MEDIUM PRIORITY (Address soon)\n\n`;
    mediumPriorityFiles.slice(0, 5).forEach(file => {
      markdown += generateFileActionItem(file);
    });
  }

  if (lowPriorityFiles.length > 0) {
    markdown += `#### 🟢 LOW PRIORITY (Improve when possible)\n\n`;
    markdown += `- ${lowPriorityFiles.length} files have good test coverage and mutation scores\n`;
  }

  markdown += `\n---\n\n`;
  return markdown;
}

function calculatePriority(coverage, mutationScore, survivedMutants) {
  let priority = 0;
  
  // No coverage is highest priority
  if (coverage < 10) priority += 10;
  else if (coverage < 50) priority += 7;
  else if (coverage < 80) priority += 4;
  
  // Poor mutation score
  if (mutationScore < 60) priority += 5;
  else if (mutationScore < 80) priority += 2;
  
  // Many survived mutants
  if (survivedMutants > 10) priority += 3;
  else if (survivedMutants > 5) priority += 1;
  
  return priority;
}

function generateFileActionItem(file) {
  const issues = [];
  
  if (file.coverage < 50) {
    issues.push(`❌ Very low test coverage (${file.coverage.toFixed(1)}%)`);
  } else if (file.coverage < 80) {
    issues.push(`⚠️ Low test coverage (${file.coverage.toFixed(1)}%)`);
  }
  
  if (file.mutationScore < 60) {
    issues.push(`❌ Poor mutation score (${file.mutationScore.toFixed(1)}%)`);
  } else if (file.mutationScore < 80) {
    issues.push(`⚠️ Low mutation score (${file.mutationScore.toFixed(1)}%)`);
  }
  
  if (file.survivedMutants > 5) {
    issues.push(`❌ ${file.survivedMutants} survived mutants need test improvements`);
  }
  
  const actions = generateRecommendedActions(file);
  
  return `**${file.filePath}**
- Issues: ${issues.join(', ')}
- Recommended actions: ${actions}
- Stats: ${file.noCoverageMutants}/${file.totalMutants} no coverage, ${file.survivedMutants} survived

`;
}

function generateRecommendedActions(file) {
  const actions = [];
  
  if (file.coverage < 50) {
    actions.push('Add comprehensive unit tests');
  }
  
  if (file.survivedMutants > 0) {
    actions.push('Strengthen test assertions');
    actions.push('Add edge case tests');
  }
  
  if (file.noCoverageMutants > file.totalMutants * 0.5) {
    actions.push('Improve code coverage');
  }
  
  return actions.length > 0 ? actions.join(', ') : 'Monitor for regressions';
}

function generateDetailedAnalysis(report) {
  const stats = calculateOverallStats(report);
  
  let markdown = `## 🔍 Detailed Analysis

### Mutation Testing Metrics Explained

**Mutation Score**: Percentage of mutants killed by tests (excluding no-coverage mutants)
- 🟢 ≥80%: Excellent test quality
- 🟡 60-79%: Good test quality  
- 🔴 <60%: Tests need improvement

**Coverage Score**: Percentage of code covered by tests
- 🟢 ≥90%: Excellent coverage
- 🟡 70-89%: Good coverage
- 🔴 <70%: Poor coverage

### Top Mutation Operators Analysis

`;

  // Sort mutators by impact (survived + no coverage)
  const sortedMutators = Object.entries(stats.mutatorStats)
    .map(([name, stats]) => ({
      name,
      ...stats,
      impact: stats.survived + stats.noCoverage,
      killRate: stats.total > 0 ? ((stats.killed / stats.total) * 100) : 0
    }))
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 10);

  markdown += `| Mutator | Total | Killed | Survived | No Coverage | Kill Rate |
|---------|-------|--------|----------|-------------|-----------|
`;

  sortedMutators.forEach(mutator => {
    const emoji = mutator.killRate >= 80 ? '🟢' : mutator.killRate >= 60 ? '🟡' : '🔴';
    markdown += `| ${mutator.name} | ${mutator.total} | ${mutator.killed} | ${mutator.survived} | ${mutator.noCoverage} | ${emoji} ${mutator.killRate.toFixed(1)}% |\n`;
  });

  // Add detailed mutator analysis
  markdown += `\n### Mutator-Specific Analysis

`;

  sortedMutators.slice(0, 5).forEach(mutator => {
    markdown += `#### ${mutator.name}
- **Total Mutations**: ${mutator.total}
- **Success Rate**: ${mutator.killRate.toFixed(1)}%
- **Impact**: ${mutator.impact > 0 ? 'High' : 'Low'} (${mutator.survived} survived, ${mutator.noCoverage} uncovered)
- **Recommendation**: ${getMutatorRecommendation(mutator)}

`;
  });

  // Survival reasons analysis
  if (Object.keys(stats.survivalReasons).length > 0) {
    markdown += `\n### Test Failure Patterns

Understanding why mutants survived can help improve test quality:

`;
    Object.entries(stats.survivalReasons)
      .sort(([,a], [,b]) => b - a)
      .forEach(([reason, count]) => {
        markdown += `- **${reason}**: ${count} failures\n`;
      });
  }

  // Add comprehensive test effectiveness analysis
  markdown += generateTestEffectivenessAnalysis(report);

  markdown += `\n---\n\n`;
  return markdown;
}

function generateFileBreakdown(report) {
  let markdown = `## 📁 File-by-File Breakdown

`;

  Object.entries(report.files).forEach(([filePath, fileData]) => {
    const stats = calculateFileStats(fileData);
    const emoji = getFileStatusEmoji(stats);
    
    markdown += `### ${emoji} ${filePath}

**Overall Health**: ${getHealthStatus(stats)} | **Mutation Score**: ${stats.mutationScore.toFixed(1)}% | **Coverage**: ${stats.coverage.toFixed(1)}%

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Killed | ${stats.killedMutants} | ${stats.killedPercentage.toFixed(1)}% |
| ❌ Survived | ${stats.survivedMutants} | ${stats.survivedPercentage.toFixed(1)}% |
| 🚫 No Coverage | ${stats.noCoverageMutants} | ${stats.noCoveragePercentage.toFixed(1)}% |
| **Total** | **${stats.totalMutants}** | **100%** |

`;

    // Show source code with mutation annotations
    if (fileData.source) {
      markdown += generateSourceCodeSection(fileData);
    }

    // Show critical survived mutants (limit to most important ones)
    if (stats.survivedMutants > 0) {
      const criticalMutants = fileData.mutants
        .filter(m => m.status === 'Survived')
        .slice(0, 10); // Limit to top 10 most critical

      markdown += `#### ❌ Critical Survived Mutants (First ${Math.min(criticalMutants.length, 10)})

`;
      criticalMutants.forEach((mutant, index) => {
        const errorType = extractTestFailureType(mutant.statusReason);
        markdown += `${index + 1}. **Mutant #${mutant.id}** - Line ${mutant.location.start.line}:${mutant.location.start.column}-${mutant.location.end.column}
   - **Mutator**: \`${mutant.mutatorName}\` → \`${mutant.replacement || 'N/A'}\`
   - **Issue**: ${errorType}
   - **Fix**: ${suggestFix(mutant)}
   - **Tests that should have caught this**: ${mutant.coveredBy ? mutant.coveredBy.join(', ') : 'None'}

`;
      });
    }

    // Show coverage gaps (but limit the output)
    if (stats.noCoverageMutants > 0) {
      const coverageGaps = analyzeCoverageGaps(fileData.mutants.filter(m => m.status === 'NoCoverage'));
      const noCoverageMutants = fileData.mutants.filter(m => m.status === 'NoCoverage');
      
      markdown += `#### 🚫 Coverage Gaps Summary

- **${stats.noCoverageMutants} uncovered mutants** across ${coverageGaps.lineCount} lines
- **Most affected lines**: ${coverageGaps.topLines.join(', ')}
- **Common uncovered operations**: ${coverageGaps.topMutators.join(', ')}

##### Detailed No Coverage Mutants:
${noCoverageMutants.map((mutant, index) => 
  `${index + 1}. **Mutant #${mutant.id}** - Line ${mutant.location.start.line}:${mutant.location.start.column}-${mutant.location.end.column}: \`${mutant.mutatorName}\` → \`${mutant.replacement || 'N/A'}\``
).join('\n')}

`;
    }

    // Show all killed mutants summary for comprehensive understanding
    if (stats.killedMutants > 0) {
      const killedMutants = fileData.mutants.filter(m => m.status === 'Killed');
      const testCoverage = analyzeTestCoverage(killedMutants);
      
      markdown += `#### ✅ Successfully Killed Mutants Summary

- **${stats.killedMutants} mutants killed** by tests
- **Average tests per mutant**: ${testCoverage.avgTestsPerMutant.toFixed(1)}
- **Most effective test**: ${testCoverage.mostEffectiveTest} (killed ${testCoverage.maxKillCount} mutants)
- **Top mutator types killed**: ${testCoverage.topKilledMutators.join(', ')}

`;
    }

    markdown += `---

`;
  });

  return markdown;
}

function calculateFileStats(fileData) {
  const totalMutants = fileData.mutants.length;
  const killedMutants = fileData.mutants.filter(m => m.status === 'Killed').length;
  const survivedMutants = fileData.mutants.filter(m => m.status === 'Survived').length;
  const noCoverageMutants = fileData.mutants.filter(m => m.status === 'NoCoverage').length;
  
  const coverage = totalMutants > 0 ? ((totalMutants - noCoverageMutants) / totalMutants) * 100 : 0;
  const mutationScore = (totalMutants - noCoverageMutants) > 0 ? (killedMutants / (totalMutants - noCoverageMutants)) * 100 : 0;
  
  return {
    totalMutants,
    killedMutants,
    survivedMutants,
    noCoverageMutants,
    coverage,
    mutationScore,
    killedPercentage: totalMutants > 0 ? (killedMutants / totalMutants) * 100 : 0,
    survivedPercentage: totalMutants > 0 ? (survivedMutants / totalMutants) * 100 : 0,
    noCoveragePercentage: totalMutants > 0 ? (noCoverageMutants / totalMutants) * 100 : 0
  };
}

function getFileStatusEmoji(stats) {
  if (stats.coverage < 50 || stats.mutationScore < 60) return '🔴';
  if (stats.coverage < 80 || stats.mutationScore < 80) return '🟡';
  return '🟢';
}

function getHealthStatus(stats) {
  if (stats.coverage >= 80 && stats.mutationScore >= 80) return '🟢 Excellent';
  if (stats.coverage >= 60 && stats.mutationScore >= 60) return '🟡 Good';
  return '🔴 Needs Improvement';
}

function suggestFix(mutant) {
  const mutatorName = mutant.mutatorName;
  
  switch (mutatorName) {
    case 'ConditionalExpression':
      return 'Add test cases for both true/false conditions';
    case 'EqualityOperator':
      return 'Test boundary conditions and edge cases';
    case 'StringLiteral':
      return 'Test with different string values including empty strings';
    case 'BooleanLiteral':
      return 'Verify behavior with both true and false values';
    case 'ArithmeticOperator':
      return 'Test with different numeric values and operators';
    case 'LogicalOperator':
      return 'Test all logical combinations (&&, ||)';
    case 'BlockStatement':
      return 'Ensure the code block is actually executed in tests';
    case 'MethodExpression':
      return 'Mock and verify method calls with different inputs';
    default:
      return 'Add specific test cases to kill this mutant';
  }
}

function analyzeCoverageGaps(noCoverageMutants) {
  const lines = new Set();
  const mutatorCounts = {};
  
  noCoverageMutants.forEach(mutant => {
    lines.add(mutant.location.start.line);
    mutatorCounts[mutant.mutatorName] = (mutatorCounts[mutant.mutatorName] || 0) + 1;
  });
  
  const topLines = Array.from(lines).sort((a, b) => a - b).slice(0, 5);
  const topMutators = Object.entries(mutatorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name);
  
  return {
    lineCount: lines.size,
    topLines,
    topMutators
  };
}

function generateSourceCodeSection(fileData) {
  const lines = fileData.source.split('\n');
  const mutantsByLine = {};
  
  // Group mutants by line number
  fileData.mutants.forEach(mutant => {
    const lineNum = mutant.location.start.line;
    if (!mutantsByLine[lineNum]) {
      mutantsByLine[lineNum] = [];
    }
    mutantsByLine[lineNum].push(mutant);
  });
  
  let markdown = `#### 📄 Source Code with Mutation Analysis

\`\`\`javascript
`;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const lineMutants = mutantsByLine[lineNum] || [];
    
    // Add line with annotation
    markdown += `${lineNum.toString().padStart(3)}| ${line}\n`;
    
    // Add mutation annotations for this line
    if (lineMutants.length > 0) {
      lineMutants.forEach(mutant => {
        const status = mutant.status === 'Killed' ? '✅' : 
                     mutant.status === 'Survived' ? '❌' : 
                     mutant.status === 'NoCoverage' ? '🚫' : '⚠️';
        const coverage = mutant.coveredBy ? `[${mutant.coveredBy.length} tests]` : '[0 tests]';
        markdown += `   ${status} #${mutant.id}: ${mutant.mutatorName} → "${mutant.replacement || 'N/A'}" ${coverage}\n`;
      });
    }
  });
  
  markdown += `\`\`\`

`;
  
  return markdown;
}

function analyzeTestCoverage(killedMutants) {
  const testKillCounts = {};
  const mutatorCounts = {};
  let totalTests = 0;
  
  killedMutants.forEach(mutant => {
    // Count tests that killed this mutant
    if (mutant.killedBy && mutant.killedBy.length > 0) {
      mutant.killedBy.forEach(testId => {
        testKillCounts[testId] = (testKillCounts[testId] || 0) + 1;
      });
    }
    
    // Count by mutator type
    mutatorCounts[mutant.mutatorName] = (mutatorCounts[mutant.mutatorName] || 0) + 1;
    
    // Count total test executions
    totalTests += (mutant.killedBy || []).length;
  });
  
  const avgTestsPerMutant = killedMutants.length > 0 ? totalTests / killedMutants.length : 0;
  
  // Find most effective test
  const mostEffectiveTestEntry = Object.entries(testKillCounts)
    .sort(([,a], [,b]) => b - a)[0];
  const mostEffectiveTest = mostEffectiveTestEntry ? mostEffectiveTestEntry[0] : 'None';
  const maxKillCount = mostEffectiveTestEntry ? mostEffectiveTestEntry[1] : 0;
  
  // Top killed mutator types
  const topKilledMutators = Object.entries(mutatorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name);
  
  return {
    avgTestsPerMutant,
    mostEffectiveTest,
    maxKillCount,
    topKilledMutators
  };
}

function generateAppendix() {
  return `## 📚 Appendix

### Understanding Mutation Testing

Mutation testing validates test quality by introducing small bugs (mutations) into your code:

1. **🟢 Killed Mutants**: Tests detected the bug ✅ Good!
2. **❌ Survived Mutants**: Tests missed the bug ❌ Need better tests  
3. **🚫 No Coverage**: Code isn't tested ❌ Need more tests

### Mutation Testing Process

1. **Mutation Generation**: The tool creates variants of your code with small changes
2. **Test Execution**: Your test suite runs against each mutant
3. **Result Analysis**: 
   - If tests fail → Mutant is "killed" (good)
   - If tests pass → Mutant "survived" (bad)
   - If no tests run → "No coverage" (very bad)

### Interpreting Results

#### Status Definitions
- **Killed**: Tests caught the mutation (test quality is good for this area)
- **Survived**: Tests didn't catch the mutation (test quality needs improvement)
- **No Coverage**: No tests executed this code (coverage gap)
- **Timeout**: Tests took too long (possible infinite loop)
- **Runtime Error**: Mutation caused a runtime error
- **Compile Error**: Mutation caused compilation to fail

#### Mutator Types Explained
- **ConditionalExpression**: Changes conditions (true ↔ false)
- **EqualityOperator**: Changes equality operators (== ↔ !=, === ↔ !==)
- **StringLiteral**: Changes string values
- **BooleanLiteral**: Changes boolean values (true ↔ false)
- **ArithmeticOperator**: Changes math operators (+, -, *, /, %)
- **LogicalOperator**: Changes logical operators (&&, ||)
- **BlockStatement**: Removes or modifies code blocks
- **MethodExpression**: Changes method calls

### Recommended Next Steps

#### Immediate Actions (Priority Order)
1. **Address High Priority Files**: Focus on files with low coverage or poor mutation scores
2. **Fix No Coverage Issues**: Add tests for uncovered code paths
3. **Improve Test Assertions**: Strengthen tests to catch survived mutants
4. **Add Edge Case Tests**: Test boundary conditions and error scenarios

#### Long-term Improvements
1. **Regular Monitoring**: Run mutation testing in CI/CD pipeline
2. **Set Quality Gates**: Require minimum mutation scores for commits
3. **Team Training**: Educate team on mutation testing principles
4. **Incremental Improvement**: Focus on most critical files first

#### Test Quality Guidelines
- **Target 80%+ mutation score** for critical business logic
- **Focus on edge cases** and error conditions
- **Test both positive and negative scenarios**
- **Verify error messages and exception types**
- **Test with various input combinations**

### Mutation Testing Best Practices

#### Do's ✅
- Use mutation testing to **guide test improvements**
- Focus on **business-critical code** first
- Set **realistic targets** (80%+ for important code)
- **Combine with code coverage** for comprehensive analysis
- **Run regularly** to prevent regression
- **Use results to improve** test design

#### Don'ts ❌
- Don't aim for 100% mutation score (some mutants are equivalent)
- Don't ignore "No Coverage" mutants
- Don't rely solely on mutation score
- Don't test generated or trivial code extensively
- Don't let perfect be the enemy of good

### Troubleshooting Common Issues

#### Low Mutation Score
- **Symptom**: Many survived mutants
- **Solution**: Add more specific assertions and edge case tests
- **Example**: Test both success and failure paths

#### No Coverage Issues  
- **Symptom**: High percentage of uncovered mutants
- **Solution**: Increase test coverage first, then improve test quality
- **Example**: Add unit tests for all public methods

#### Equivalent Mutants
- **Symptom**: Mutants that don't change behavior
- **Solution**: This is normal - focus on actionable mutants
- **Example**: Changing variable names doesn't affect functionality

### Integration with Development Workflow

#### CI/CD Integration
\`\`\`bash
# Example pipeline step
npm run test:mutation
if mutation_score < 80%; then
  echo "Mutation score too low"
  exit 1
fi
\`\`\`

#### Git Hooks
\`\`\`bash
# Pre-commit hook
npm run test:mutation:changed-files
\`\`\`

#### Quality Gates
- **Minimum mutation score**: 70% for new code
- **No decrease**: Mutation score shouldn't drop
- **Coverage requirement**: 90%+ line coverage before mutation testing

### Additional Resources

- [Mutation Testing Guide](https://stryker-mutator.io/docs/)
- [Best Practices](https://blog.stryker-mutator.io/blog/)
- [Academic Research](https://en.wikipedia.org/wiki/Mutation_testing)
- [Interpreting Results](https://github.com/stryker-mutator/stryker/blob/master/docs/mutation-testing-elements/supported-mutators.md)

### Tool Configuration

#### Stryker Configuration Tips
\`\`\`json
{
  "mutate": ["src/**/*.js", "!src/**/*.test.js"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
\`\`\`

#### Performance Optimization
- Use **coverage analysis** to speed up execution
- **Exclude test files** from mutation
- **Parallelize execution** when possible
- **Use incremental mode** for large codebases

---

*Report generated by Stryker Mutation Testing Framework*  
*For questions or issues, consult your development team or the Stryker documentation.*

**Report Generation Details**
- Generated: ${new Date().toISOString()}
- Stryker Version: Latest
- Analysis Includes: Source code, test coverage, mutant details, recommendations
- Interactive Version: Available at \`html/index.html\`
`;
}

function getSpecificMutatorRecommendation(name) {
  switch (name) {
    case 'ConditionalExpression':
      return 'Add test cases for both true/false conditions and edge cases in conditional logic.';
    case 'EqualityOperator':
      return 'Test boundary conditions, null/undefined values, and different data types.';
    case 'StringLiteral':
      return 'Test with different string values including empty strings, whitespace, and special characters.';
    case 'BooleanLiteral':
      return 'Verify behavior with both true and false values, including truthy/falsy conversions.';
    case 'ArithmeticOperator':
      return 'Test with different numeric values, edge cases (0, negative numbers), and operator precedence.';
    case 'LogicalOperator':
      return 'Test all logical combinations (&&, ||) and short-circuit evaluation scenarios.';
    case 'BlockStatement':
      return 'Ensure all code blocks are executed in tests and cover different execution paths.';
    case 'MethodExpression':
      return 'Mock and verify method calls with different inputs and test return values.';
    default:
      return `Add comprehensive test cases targeting the ${name} mutation type.`;
  }
}

function getMutatorRecommendation(mutator) {
  const { name, killRate, survived, noCoverage } = mutator;
  
  if (killRate >= 80) {
    return 'Tests are effectively catching this mutation type. Continue current testing approach.';
  }
  
  if (noCoverage > survived) {
    return `Primary issue is test coverage. Add tests to cover the ${noCoverage} uncovered mutations.`;
  }
  
  return getSpecificMutatorRecommendation(name);
}

function generateTestEffectivenessAnalysis(report) {
  let markdown = `\n### Test Effectiveness Analysis

`;

  // Collect all mutants across files
  const allMutants = Object.values(report.files)
    .flatMap(file => file.mutants);
  
  const testAnalysis = analyzeTestEffectiveness(allMutants);
  
  markdown += `#### Overall Test Coverage Insights
- **Total Mutants Analyzed**: ${allMutants.length}
- **Average Test Coverage per Mutant**: ${testAnalysis.avgCoveragePerMutant.toFixed(1)} tests
- **Most Tested Mutant**: #${testAnalysis.mostTestedMutant.id} (covered by ${testAnalysis.mostTestedMutant.coverage} tests)
- **Least Tested Areas**: ${testAnalysis.leastTestedAreas.join(', ')}

#### Test Quality Metrics
- **Mutation Detection Rate**: ${testAnalysis.detectionRate.toFixed(1)}%
- **Test Efficiency**: ${testAnalysis.efficiency.toFixed(1)}% (killed/covered ratio)
- **Coverage Gaps**: ${testAnalysis.coverageGaps} lines not covered by any tests

`;

  // Show top performing tests if we have test data
  if (testAnalysis.topTests.length > 0) {
    markdown += `#### Top Performing Tests
${testAnalysis.topTests.map((test, index) => 
      `${index + 1}. **Test #${test.id}**: Killed ${test.killCount} mutants, covered ${test.coverageCount}`
    ).join('\n')}

`;
  }

  return markdown;
}

function analyzeTestEffectiveness(mutants) {
  const testStats = {};
  let totalCoverage = 0;
  let totalKilled = 0;
  const mutatorsByLine = {};
  
  mutants.forEach(mutant => {
    // Track coverage per mutant
    const coverageCount = (mutant.coveredBy || []).length;
    totalCoverage += coverageCount;
    
    if (mutant.status === 'Killed') {
      totalKilled++;
    }
    
    // Track by line for gap analysis
    const line = mutant.location.start.line;
    if (!mutatorsByLine[line]) {
      mutatorsByLine[line] = { total: 0, covered: 0 };
    }
    mutatorsByLine[line].total++;
    if (coverageCount > 0) {
      mutatorsByLine[line].covered++;
    }
    
    // Track test performance
    (mutant.coveredBy || []).forEach(testId => {
      if (!testStats[testId]) {
        testStats[testId] = { coverageCount: 0, killCount: 0 };
      }
      testStats[testId].coverageCount++;
    });
    
    (mutant.killedBy || []).forEach(testId => {
      if (!testStats[testId]) {
        testStats[testId] = { coverageCount: 0, killCount: 0 };
      }
      testStats[testId].killCount++;
    });
  });
  
  const avgCoveragePerMutant = mutants.length > 0 ? totalCoverage / mutants.length : 0;
  const detectionRate = mutants.length > 0 ? (totalKilled / mutants.length) * 100 : 0;
  const coveredMutants = mutants.filter(m => (m.coveredBy || []).length > 0).length;
  const efficiency = coveredMutants > 0 ? (totalKilled / coveredMutants) * 100 : 0;
  
  // Find most tested mutant
  const mostTestedMutant = mutants.reduce((prev, current) => {
    const prevCoverage = (prev.coveredBy || []).length;
    const currentCoverage = (current.coveredBy || []).length;
    return currentCoverage > prevCoverage ? current : prev;
  }, mutants[0] || { id: 'N/A', coveredBy: [] });
  
  // Find coverage gaps
  const coverageGaps = Object.values(mutatorsByLine)
    .filter(line => line.covered === 0).length;
  
  // Find least tested areas (mutator types with low coverage)
  const mutatorCoverage = {};
  mutants.forEach(mutant => {
    const type = mutant.mutatorName;
    if (!mutatorCoverage[type]) {
      mutatorCoverage[type] = { total: 0, covered: 0 };
    }
    mutatorCoverage[type].total++;
    if ((mutant.coveredBy || []).length > 0) {
      mutatorCoverage[type].covered++;
    }
  });
  
  const leastTestedAreas = Object.entries(mutatorCoverage)
    .map(([type, stats]) => ({ 
      type, 
      rate: stats.total > 0 ? stats.covered / stats.total : 0 
    }))
    .filter(item => item.rate < 0.8)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3)
    .map(item => item.type);
  
  // Top performing tests
  const topTests = Object.entries(testStats)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.killCount - a.killCount)
    .slice(0, 5);
  
  return {
    avgCoveragePerMutant,
    detectionRate,
    efficiency,
    mostTestedMutant: {
      id: mostTestedMutant.id,
      coverage: (mostTestedMutant.coveredBy || []).length
    },
    coverageGaps,
    leastTestedAreas,
    topTests
  };
}

if (require.main === module) {
  generateMarkdownReport();
}

module.exports = { generateMarkdownReport };
