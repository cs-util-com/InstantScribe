---
name: Agent Task
about: Task specifically designed for autonomous AI agents
title: '[AGENT] '
labels: ['agent-task', 'automation']
assignees: ''
---

## Task Overview
**Objective:**
<!-- Clear, specific description of what the agent should accomplish -->

**Priority:** <!-- High/Medium/Low -->

## Detailed Requirements

### Primary Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### Technical Constraints
- [ ] Must maintain 100% test coverage
- [ ] Must pass all quality gates (`npm run check:all`)
- [ ] Must follow existing code patterns
- [ ] Must not introduce breaking changes

### Success Criteria
<!-- Very specific, measurable criteria for completion -->
- [ ] All tests pass: `npm test`
- [ ] Quality checks pass: `npm run check:all`
- [ ] Mutation testing >50%: `npm run mutation`
- [ ] Specific functionality works as described
- [ ] Documentation is updated if needed

## Implementation Guidance

### Suggested Approach
<!-- Step-by-step guidance for the agent -->
1. Analyze existing code structure
2. Write tests first (TDD approach)
3. Implement incrementally
4. Validate continuously

### Files to Consider
<!-- List relevant files the agent should examine/modify -->
```
src/
├── components/
├── utils/
├── index.js
index.html
package.json
```

### Testing Strategy
- **Unit tests:** Test individual functions/components
- **Property tests:** Use fast-check for complex logic
- **Integration tests:** Test component interactions
- **Manual verification:** Test in browser if UI changes

## Quality Gates
Before opening PR, ensure:
```bash
npm test              # All tests pass
npm run check:all     # All quality checks pass
npm run validate:all  # Complete validation
```

## Agent Instructions
**Branch naming:** `agent/[issue-number]-[short-description]`

**Commit strategy:**
- Small, focused commits
- Clear commit messages
- Reference this issue number

**Error handling:**
- If tests fail, analyze each failure individually
- Fix simplest issues first
- Make minimal changes
- Verify fixes immediately

---

**Ready for agent assignment:** Comment `@claude` or `/cursor start` to assign this task to an autonomous agent.
