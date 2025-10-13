# Autonomous Agents Setup Guide

This repository is configured to work with autonomous AI agents that can automatically implement features, fix bugs, and maintain code quality. This guide explains how to use and configure these agents.

## Available Agents

### 1. Claude Code Agent

**Trigger:** Comment `@claude` on any issue or PR  
**Capabilities:** Full feature implementation, bug fixes, code refactoring  
**Workflow:** `.github/workflows/claude-agent.yml`

**Setup Requirements:**

1. Install Claude Code GitHub App: https://github.com/apps/claude-code
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Ensure repository permissions allow Actions to create PRs

**Usage Example:**

```
@claude please implement the user authentication feature described in this issue
```

### 2. Cursor CLI Agent

**Trigger:** Comment `/cursor start` on any issue  
**Capabilities:** Feature implementation with direct CLI access  
**Workflow:** `.github/workflows/cursor-agent.yml`

**Setup Requirements:**

1. Add `CURSOR_API_KEY` to repository secrets
2. Ensure repository has write permissions for Actions

**Usage Example:**

```
/cursor start
```

### 3. Quality Assurance Agent

**Trigger:** Automatic (daily at 2 AM UTC) or manual dispatch  
**Capabilities:** Comprehensive quality checks, security audits, automated issue creation  
**Workflow:** `.github/workflows/qa-agent.yml`

**Features:**

- Daily quality scans
- Automatic issue creation for problems
- Security vulnerability detection
- Test coverage monitoring

## Repository Configuration

### Agent Guidelines (`AGENTS.md`)

Canonical agent instructions live in the repository root `AGENTS.md`. It includes:

- Development standards and quality requirements
- Testing strategies and coverage requirements
- File structure conventions
- Error handling approaches
- Success criteria and validation steps

### Cursor Rules (`.cursor/rules`)

Provides Cursor CLI agents with:

- Project overview and principles
- Development workflow guidelines
- Code standards and testing requirements
- Quality gates and validation steps

## Issue Templates

### Feature Request Template

- **File:** `.github/ISSUE_TEMPLATE/feature_request.md`
- **Purpose:** Structured feature requests with clear requirements
- **Agent-friendly:** Includes implementation guidance and testing strategy

### Bug Report Template

- **File:** `.github/ISSUE_TEMPLATE/bug_report.md`
- **Purpose:** Detailed bug reports with reproduction steps
- **Agent-friendly:** Includes investigation notes and fix requirements

### Agent Task Template

- **File:** `.github/ISSUE_TEMPLATE/agent_task.md`
- **Purpose:** Tasks specifically designed for autonomous agents
- **Features:** Clear objectives, technical constraints, success criteria

## Quality gates and validation

To avoid duplication, refer to the canonical guidance in AGENTS.md for:

- Required tests and quality checks
- Exact validation commands to run locally and before PRs

Agents should follow AGENTS.md as the single source of truth and must pass all checks defined there before opening a PR.

## Security and Permissions

### Repository Secrets Required

- `ANTHROPIC_API_KEY` - For Claude Code agent
- `CURSOR_API_KEY` - For Cursor CLI agent
- `GITHUB_TOKEN` - Automatically provided (for PR/issue management)

### Workflow Permissions

All agent workflows are configured with minimal required permissions:

- `contents: write` - For code changes
- `pull-requests: write` - For PR creation
- `issues: write` - For status updates

### Branch Protection

Recommended settings:

- Require PR reviews before merging
- Require status checks to pass
- Restrict pushes to main branch
- Allow agents to create PRs but not merge them

## Usage Patterns

### 1. Feature Development

1. Create issue using Feature Request template
2. Comment `@claude` or `/cursor start` to assign to agent
3. Agent creates branch, implements feature, writes tests
4. Agent opens PR with comprehensive description
5. Human review and merge

### 2. Bug Fixes

1. Create issue using Bug Report template
2. Include reproduction steps and error details
3. Assign to agent with trigger comment
4. Agent investigates, fixes, and adds regression tests
5. Human verification and merge

### 3. Quality Maintenance

1. QA Agent runs automatically every night
2. Creates issues for any problems found
3. Can assign these issues to implementation agents
4. Maintains continuous code quality

## Monitoring and Observability

### Workflow Status

- All workflows post status comments on issues
- Success/failure notifications include next steps
- Logs available in Actions tab for debugging

### Quality Metrics

- Test coverage reports uploaded as artifacts
- Mutation testing reports generated
- Quality check results tracked over time

### Cost Management

- Workflow timeouts prevent runaway costs
- Concurrency limits prevent parallel execution conflicts
- Turn limits cap agent iterations

## Troubleshooting

### Agent Not Responding

1. Check repository secrets are configured
2. Verify workflow permissions
3. Review workflow logs for errors
4. Ensure trigger phrases are exact

### Quality Gate Failures

1. Review specific failure in CI logs
2. Run tests locally: `npm test`
3. Check quality issues: `npm run check:all`
4. Fix issues incrementally

### Permission Issues

1. Verify repository settings allow Actions to create PRs
2. Check branch protection rules
3. Ensure secrets are accessible to workflows

## Best Practices

### For Maintainers

- Use descriptive issue titles and clear requirements
- Review agent-created PRs thoroughly
- Maintain branch protection and review requirements
- Monitor agent activity and costs

### For Contributors

- Use issue templates for consistent agent input
- Provide clear acceptance criteria
- Include test scenarios in requirements
- Review agent implementations before merging

### For Agent Optimization

- Keep requirements specific and actionable
- Include relevant context and constraints
- Specify test requirements explicitly
- Use incremental development approach

## Advanced Configuration

### Custom Agent Triggers

Modify workflow files to add custom trigger phrases:

```yaml
if: contains(github.event.comment.body, 'your-custom-trigger')
```

### Environment-Specific Settings

Configure different behaviors for different environments by modifying workflow conditions and environment variables.

### Integration with External Tools

Agents can be extended to integrate with:

- External APIs for testing
- Deployment systems
- Monitoring tools
- Custom quality gates

## Getting Started

1. **Configure secrets** in repository settings
2. **Set up branch protection** rules
3. **Create your first issue** using an agent template
4. **Trigger an agent** with `@claude` or `/cursor start`
5. **Review the results** and iterate as needed

The autonomous agents are designed to work within your existing development workflow while providing powerful automation capabilities. Start with simple tasks and gradually expand to more complex implementations as you become comfortable with the system.
