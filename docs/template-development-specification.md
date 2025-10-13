# Single-Page Web App Development Spec (Concise)

Purpose: Practical, minimal guidance for building and iterating on this no-build, static SPA with modern JS and AI-assisted workflows.

## 1) Core principles

- Requirements first: define user stories and acceptance criteria.
- Small, focused iterations: one feature/bugfix per commit.
- AI-assisted coding: write a short spec, then implement with tests.
- Keep it simple: static HTML + modular JS; no bundlers.

## 2) Project structure

```
/
├── index.html          # Entry HTML
├── pages/              # Additional static pages
├── src/                # App code (modules + tests)
│   ├── index.js        # App entry module
│   ├── components/     # Reusable UI modules
│   ├── utils/          # Helpers/utilities
│   └── assets/         # Static assets (JSON, images)
├── config/             # Jest/ESLint/etc. configs
└── package.json        # Scripts and dev tooling
```

Naming: camelCase files; `*.test.js` for unit tests; `*.property.test.js` for fast-check tests.

## 3) Development practices

- Single responsibility modules with explicit exports; minimize dependencies.
- Co-locate tests with code; keep tests deterministic and fast.
- Separate concerns: structure in HTML, behavior in `src/`, data in `assets/`.
- Prefer plain ES modules and browser APIs; avoid framework lock-in.

## 4) Workflow (high level)

1. Write/confirm a short requirement. 2) Implement incrementally. 3) Add/update tests alongside code. 4) Run quality checks. 5) Commit and push.

Commands, quality gates, and validation are defined centrally in AGENTS.md. Use those as the single source of truth.

## 5) Architecture guidelines

- Components: small, testable, and composable; keep data flow explicit.
- Errors: validate inputs, fail fast with helpful messages, and degrade gracefully.
- Boundaries: keep components/utils decoupled; avoid circular deps.

## 6) Customization

- Safe: update `index.html`, add modules under `src/components` and `src/utils`, expand `pages/`, and add data in `src/assets`.
- Config: adjust files under `config/` only when necessary; prefer minimal changes.

## 7) References (canonical)

- AGENTS and quality gates: ../AGENTS.md
- Code quality details: ./code-quality-specification.md
- Project overview & Pages: ../README.md

Use this concise spec for day-to-day work. For exact commands, standards, and validation steps, follow AGENTS.md.
