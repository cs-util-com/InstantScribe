Instructions to add a **native Git pre-commit hook** that blocks commits unless **lint** and **tests** pass:

---

## 0) Prereqs (once)

Ensure `package.json` has lint and test scripts defined.

---

## 1) Add a versioned hooks directory

```bash
mkdir -p .githooks
git config core.hooksPath .githooks
```

> This tells Git to use `.githooks/` (which is tracked in the repo) instead of the untracked `.git/hooks/`.

---

## 2) Create the pre-commit hook

Create `.githooks/pre-commit` with the following content:

```bash
#!/usr/bin/env sh
# Abort the commit if lint or tests fail.
# Works on macOS/Linux and in Git Bash on Windows.

set -eu

echo "🔎 Linting..."
npm run -s lint || { echo "❌ Lint failed"; exit 1; }

echo "🧪 Running tests..."
npm test --silent || { echo "❌ Tests failed"; exit 1; }

echo "✅ Pre-commit checks passed"
```

Make it executable (choose one):

```bash
# Portable way (works on Windows too):
git update-index --chmod=+x .githooks/pre-commit

# Or the POSIX way:
chmod +x .githooks/pre-commit
```

Commit the hook:

```bash
git add .githooks/pre-commit
git commit -m "chore: add native pre-commit hook for lint and tests"
```

---

## 3) Quick self-test

```bash
git commit --allow-empty -m "test hook"
# Expect the hook to run; commit only succeeds if lint & tests pass.
```

---

## Additional Notes

- Developers can bypass local hooks with `--no-verify`, so keep CI with required checks as the final gate.
- For faster commits, consider moving long-running suites to a `pre-push` hook or to CI.
