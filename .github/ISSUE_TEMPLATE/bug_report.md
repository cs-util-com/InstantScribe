---
name: Bug Report
about: Report a bug or issue with the template
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## Bug Description
**Current behavior:**
<!-- Describe what is currently happening -->

**Expected behavior:**
<!-- Describe what should happen instead -->

**Steps to reproduce:**
1. 
2. 
3. 

## Environment
- Browser: <!-- e.g., Chrome 91, Firefox 89 -->
- Node version: <!-- run `node --version` -->
- NPM version: <!-- run `npm --version` -->
- Operating System: <!-- e.g., Windows 10, macOS 11, Ubuntu 20.04 -->

## Code/Error Details
**Error messages:**
```
<!-- Paste any error messages here -->
```

**Relevant code:**
```javascript
// Paste relevant code here
```

**Test failures:**
```
<!-- If tests are failing, paste the output -->
```

## Investigation Notes
**Files involved:**
<!-- List files where the bug might be located -->

**Potential causes:**
<!-- Any theories about what might be causing this -->

## Fix Requirements
- [ ] Must fix the reported behavior
- [ ] Must not break existing functionality
- [ ] Must include test coverage for the fix
- [ ] Must pass all quality gates

## Acceptance Criteria
- [ ] Bug is resolved
- [ ] Tests pass: `npm test`
- [ ] Quality checks pass: `npm run check:all`
- [ ] No regression in existing features

---

**For AI Agents:**
To fix this bug, create a branch named `agent/[issue-number]-fix-[bug-description]` and:
1. Write a failing test that reproduces the bug
2. Implement the minimal fix
3. Ensure all tests pass
4. Run complete validation with `npm run validate:all`
