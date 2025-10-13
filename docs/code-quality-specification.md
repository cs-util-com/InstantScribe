# Robust Test & Code Quality Specification (Concise)

Objective: ensure that any change (human- or AI-authored) satisfies general correctness and sound architecture without relying on hardcoded mappings, brittle examples, or shortcuts.

---

## 1) Scope & Goals

- Prevent “cheat” implementations (lookup tables, case-by-case conditionals, trivial heuristics) from passing tests.
- Enforce **property-based** and **metamorphic** validation, **differential checks**, and **fuzzing**.
- Require **mutation-score gates** and **branch coverage thresholds**.
- Enforce **code reuse**, **layered architecture**, and avoid **copy-paste** and **cycles**.
- Provide reproducible local dev workflow and CI that runs with multiple randomized seeds.

---

## 2) Definitions

- **Core function**: any non-trivial pure/mostly-pure function in `src/` responsible for algorithmic behavior.
- **Metamorphic relation**: predictable output relation under a controlled input transformation (e.g., scale/permute/translate).

---

## 3) Tooling (reference only)

Core tools: Jest, fast-check, Stryker, ESLint, jscpd, dependency-cruiser, madge. Use the scripts defined in `package.json`, the tool configs under `config/`, and the Stryker config in `mutation-testing/stryker.conf.json`. For exact commands and validation flow, follow `../AGENTS.md`.

---

## 4) Test layout (co-located)

Place tests next to code: `*.test.js` for unit tests and `*.property.test.js` for property/metamorphic tests under `src/**`. Keep tests deterministic and fast.

---

## 5) Coding & Testing Requirements

### 5.1 General Implementation Rules

- Implement **general algorithms**; avoid large `switch/case` or literal maps keyed by example inputs.
- Prefer **composition** and reuse of existing utilities.
- Avoid new external deps unless justified (see §7.3 dependency guard).

### 5.2 Property‑Based Testing (PBT)

- For each **core function**, add at least one property test using `fast-check`.
- Minimum **200 runs** per property in CI; locally may be reduced for speed.
- Typical properties to consider (choose those fitting the domain):
  - **Idempotence**: \`f(f(x)) === f(x)\`
  - **Inverse**: \`decode(encode(x)) === x\`
  - **Monotonicity/Ordering**: \`a ≤ b ⇒ f(a) ≤ f(b)\`
  - **Algebraic laws**: associativity, commutativity, identity, inverse
  - **Invariance**: permutation/translation/scale invariance where expected

### 5.3 Metamorphic Testing

- At least **one metamorphic relation per core function**.
- Example patterns:
  - **Scale invariance**: scaling inputs changes magnitude but preserves direction
  - **Permutation invariance**: reordering inputs yields identical reduced result
  - **Additive translation**: adding a constant offsets outputs predictably

### 5.5 Fuzz & Edge Cases

- Generate extremes: empty arrays, duplicates, long strings, Unicode, NaN/Infinity, boundary numerics.
- Seed handling: use env var **`FAST_CHECK_SEED`** to replay locally; CI overrides with multiple seeds.

### 5.6 Performance Guards (optional)

For hot paths, add a simple benchmark and watch for regressions. Keep this lightweight.

---

## 6) Test quality gates

### 6.1 Mutation Testing Gate

Minimum mutation score: >= 50%. Run Stryker in validation; fail if below.

### 6.2 Coverage Gate

Branch coverage >= 90% (and lines/functions/statements similarly high). Enforced via Jest config.

### 6.3 Property presence & test shape

At least one property test per core function using `.property.test.js`.

---

## 7) Architectural & reuse rules

### 7.1 Duplication guard (jscpd)

Threshold ≤ 1% duplicated lines. Prefer reuse and refactor when exceeded.

### 7.2 Module boundaries (dependency-cruiser)

Keep layers clean, avoid deep imports, and forbid cycles. Rules live in `config/.dependency-cruiser.js`.

### 7.3 Dependency hygiene

Avoid adding external deps unless necessary and justified.

### 7.4 Cycle detection (madge)

Detect and fail on cycles.

---

## 8) ESLint & static rules (anti-cheat & hygiene)

Ban `eval`, `new Function`, and extending built-ins; flag overly large literal maps and `switch/case` used as lookup tables; enforce boundaries via dependency-cruiser.

## 9) Config and commands (canonical)

Avoid duplicating scripts/config here. Use:

- Commands and validation flow: `../AGENTS.md`
- Scripts: `package.json`
- Tool configs: `config/` directory

---

## 10) CI/CD

CI pipelines should run tests, mutation, and quality checks using the scripts above. Keep CI definitions DRY and aligned with `AGENTS.md`.

---

## 11) Example property test

Keep examples minimal; see tests under `src/**` for patterns. Prefer domain-relevant properties and metamorphic relations.

---

## 12) Acceptance criteria (PR gate)

Merge only when: tests (incl. property/metamorphic) pass, mutation score ≥ 50%, coverage thresholds met, duplication ≤ 1%, boundaries and cycles pass, lint passes, and any new deps are justified.

---

## 13) Developer checklist (pre-PR)

- General solution; no lookup tables or case-by-case logic
- Property-based test(s) added/updated (≥ 200 runs) and at least one metamorphic relation
- Coverage meets thresholds; mutation score meets threshold
- Duplication ≤ 1%; boundaries & cycles pass; lint passes
- Any new deps are justified and approved

---

### Notes

Thresholds can be ratcheted up as the codebase improves. Keep scripts/config single-sourced under `config/` and `package.json`.
