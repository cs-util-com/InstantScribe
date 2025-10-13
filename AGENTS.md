
# Rules

## General
- Minimal local first web app (static HTML + modular JS)
- Entrypoint: `index.html` (+ static pages in `pages/`)
- Source composed of small, focused modules in `src/` (`components/`, `utils/`, ..) with colocated tests
- Frequently during development and before each commit: run `npm test` 
- `README.md` typically contains big picture dev. spec and context. It should be kept up to date whenever the code is ready for a PR
- Static app => serve `index.html` with simple static server (e.g., VS Code Live Server)
- Only change code directly related to the current task; keep diffs small
- Preserve existing comments & docs; add concise, long-lived comments where useful and avoid narrating changes via comments
- When external documentation is needed and you lack a browsing/online search tool, ask the user to run an online search for you (e.g., "Please search for \"x\" and paste back the findings")

## Dependencies & no-build approach to use
This project follows a no-build, static workflow:
- Use native ES modules and `<script type="importmap">` to map bare specifiers when needed.
- Then load your entry/module scripts with `<script type="module">` and import using the mapped specifiers.
- Prefer CDN URLs from unpkg.com for third-party modules compatible with ESM.
- Do not add bundlers/build chains unless explicitly requested in an issue/PR.

## Test layout
- Unit specs: `*.test.js`
- Property-based specs: `*.property.test.js`
- Property-based tests are important, don't omit them for important components
- Keep tests deterministic and fast; avoid E2E unless asked

## TDD Failure loop to use
1. Prefer the simplest fix first 
2. Use TDD: Add a failing test first and run `npm test` to verify it's failing
3. Make minimal, focused changes
4. Re-run `npm test` after each fix and document real output
5. Iterate until green

## Feature development process to use

Follow this lightweight spec-first flow before coding:

1) Requirements gathering
- Ask one question at a time and iterate until requirements are clear.
- Build each question on previous answers; prefer 4+ numbered response options for the user to select from.
- For larger changes: draft a high-level implementation plan and pause for explicit user approval before modifying code.

2) Specification development
- Smaller changes: clearly state what changes, how it integrates, testing strategy and key edge cases.
- Major features: capture functional requirements, architecture choices/integration points, data handling (I/O, validation), error handling and edge cases, testing strategy (unit + property-based + integration), and any UI & performance considerations.

3) Final specification
- Compile a concise developer-ready spec markdown next to new components if any were added. Include as a first line a summary that could also be used as a commit message for the change.
