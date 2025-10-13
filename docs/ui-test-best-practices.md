# Playwright + GitHub Copilot (incl. Codespaces & CI) — Developer Report (npm + JavaScript)

This report consolidates setup and best-practices for running **Playwright** with **GitHub Copilot** locally in VS Code, inside **GitHub Codespaces**, and in **GitHub Actions**—with specific safeguards to **avoid any blocking/interactive artifacts** (e.g., “Serving HTML report… Press Ctrl+C to quit.”).

---

## 0) Key non-blocking principles (applies everywhere)

- **Never call** `npx playwright show-report` in automated flows (CI, agent runs, LLM tools); it starts a local server and blocks the process. Instead, **upload the HTML folder as an artifact** or consume **JSON/JUnit** reports. The HTML report auto-open behavior can be disabled via config or env var (see §2 and §4). ([playwright.dev][1])
- Force HTML report behavior to **not open** in any environment by setting either:
  - `reporter: [['html', { open: 'never' }]]` in `playwright-ui-tests/playwright.config.js`, or
  - `PLAYWRIGHT_HTML_OPEN=never` in the environment. ([playwright.dev][1])

- Prefer non-interactive reporters in pipelines/agent runs: `github`, `json`, `junit`, or `dot/line`. ([playwright.dev][1])
- Avoid `--ui` in automation. **UI Mode** is for humans; it runs a dev server. If you must use it in Codespaces for manual debugging, bind host/port and close it yourself. ([playwright.dev][2])

---

## 1) Local VS Code (manual/dev usage, non-blocking defaults)

### Install & scaffold

```bash
npm init -y
npm i -D @playwright/test
npx playwright install
```

### `package.json` scripts (JS)

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui", // manual only
    "show-report": "playwright show-report", // manual only
    "show-report:last": "playwright show-report playwright-report"
  }
}
```

### `playwright.config.js` (JavaScript, safe defaults)

> In this repository, the config file lives at `playwright-ui-tests/playwright.config.js`; adjust paths if you copy these defaults.

```js
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail build if test.only is committed
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'junit.xml' }],
      ]
    : [['list'], ['html', { open: 'never' }]], // never auto-open HTML
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

Rationale: `forbidOnly`, CI-only retries, the `github` reporter for annotations, and `webServer.reuseExistingServer` are recommended practices directly from Playwright docs. ([playwright.dev][3])

> Tip: the most current CLI flags/commands are always in the “Command line” docs (`npx playwright --help`). ([playwright.dev][4])

---

## 2) HTML/JSON/JUnit reports without blocking

- The **HTML reporter** writes a static folder (`playwright-report/`). By default, Playwright may **auto-open** on failure; disable it via `open: 'never'` or `PLAYWRIGHT_HTML_OPEN=never`. **Do not** run `show-report` in automation; upload the folder as an artifact. ([playwright.dev][1])
- For machine consumption, use **JSON** (`--reporter=json`) or **JUnit** (`--reporter=junit`) and write files via config or `PLAYWRIGHT_JSON_OUTPUT_NAME` / `PLAYWRIGHT_JUNIT_OUTPUT_NAME`. ([playwright.dev][1])
- The “Serving HTML report… Press Ctrl+C to quit.” message is emitted by the **report server** (e.g., after `show-report`); avoid invoking it in CI/agent contexts. Community threads confirm this is what causes blocking in pipelines. ([Stack Overflow][5])

---

## 3) GitHub Actions CI (npm + JavaScript)

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push: { branches: [main, master] }
  pull_request: { branches: [main, master] }

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    env:
      PLAYWRIGHT_HTML_OPEN: 'never' # belt & braces: never auto-open
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm # npm dependency cache

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers + OS deps
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload HTML report (static files)
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload machine-readable reports
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-results
          path: |
            test-results.json
            junit.xml
```

Why this works:

- The **Playwright GitHub Action is deprecated**; use the CLI + `install --with-deps`. ([GitHub][6], [playwright.dev][7])
- **Cache npm** via `setup-node@v4` (`cache: 'npm'`). ([GitHub][8], [GitHub Docs][9])
- Upload the **static HTML folder** instead of serving it; no blocking server. The CI guide explicitly covers how to view reports and traces from artifacts. ([playwright.dev][10])

---

## 4) GitHub Codespaces (VS Code Web/Desktop attached)

### Devcontainer to preinstall browsers & forward UI port

`.devcontainer/devcontainer.json`:

```json
{
  "name": "e2e-playwright",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:0-20",
  "forwardPorts": [9323],
  "portsAttributes": {
    "9323": { "label": "Playwright UI" }
  },
  "postCreateCommand": "npm ci && npx playwright install --with-deps",
  "customizations": {
    "vscode": {
      "extensions": ["ms-playwright.playwright", "github.copilot-chat"]
    }
  }
}
```

- Use `--with-deps` to install required OS packages inside the container. ([playwright.dev][7])

### Using UI Mode (manual only)

When a human debugs in Codespaces, bind host/port and use the forwarded link:

```bash
npx playwright test --ui --ui-host=0.0.0.0 --ui-port=9323
```

Docs note the security/visibility model for Codespaces and why `--ui-host=0.0.0.0` is required in containers. Don’t run this in agent/CI flows. ([playwright.dev][2], [GitHub][11])

---

## 5) GitHub Copilot **driving** Playwright (MCP)

If the goal is for Copilot to **operate** a real browser (navigate, click, extract content) and then emit Playwright specs, enable agent mode with a Playwright **MCP server**.

### Add the Playwright MCP server to VS Code

From VS Code CLI:

```bash
code --add-mcp "{\"name\":\"playwright\",\"command\":\"npx\",\"args\":[\"@playwright/mcp@latest\"]}"
```

- VS Code documents `--add-mcp` for installing MCP servers. ([code.visualstudio.com][12])
- GitHub Copilot docs explain agent mode + MCP usage and enterprise policy controls. ([GitHub Docs][13])
- The Playwright MCP server repo provides stdio config examples and optional flags (e.g., `--storage-state`). ([GitHub][14])

> Codespaces note: MCP in a devcontainer works the same; you can embed the server in `devcontainer.json` under `customizations.vscode.mcp.servers` for team consistency. (See VS Code MCP docs for managing MCP servers via settings or command palette.) ([code.visualstudio.com][15])

### Non-blocking when using MCP

- Ask Copilot Agent to **execute tests** (CLI) and **collect JSON/JUnit**; **do not** ask it to “open the HTML report” or “serve the report.”
- If a human wants to inspect the HTML, run `npm run show-report` interactively—outside agent flows.

---

## 6) Copilot prompting patterns that yield robust Playwright

- Provide **code context** (component files, routes). Then instruct:
  “Generate Playwright tests for `Checkout`. Prefer `getByRole`/`getByLabel`, use web-first assertions, do not use hard waits, baseURL is `/`. Cover add-to-cart, remove, checkout happy path.”
- These match Playwright best practices: **role-based locators**, **web-first assertions**, and keeping selectors resilient. ([playwright.dev][3])

---

## 7) Quick compliance checklist

- ✅ **No blocking servers** in automation: don’t invoke `show-report`; set `open: 'never'` or `PLAYWRIGHT_HTML_OPEN=never`. ([playwright.dev][1])
- ✅ Reporters: **`github`** (CI annotations), plus **JSON/JUnit** for machine reading; HTML folder uploaded as artifact. ([playwright.dev][1])
- ✅ CI installs: `npx playwright install --with-deps` on Linux. ([playwright.dev][7])
- ✅ Codespaces UI (manual only): `--ui-host=0.0.0.0` and a forwarded port. ([playwright.dev][2])
- ✅ Avoid the deprecated **`microsoft/playwright-github-action`**; use CLI. ([GitHub][6])
- ✅ Standard config hygiene: `forbidOnly`, CI-only retries, trace on first retry, reuse local dev server. ([playwright.dev][3])

---

## 8) Ready-to-copy files

### `.github/workflows/playwright.yml`

(see §3)

### `playwright.config.js`

(see §1)

### `.devcontainer/devcontainer.json`

(see §4)

### Optional: Repo-specific agent notes

Keep agent-facing guidance centralized in `AGENTS.md`. For Playwright specifics, add a short subsection there (or link to this document) rather than maintaining a separate `.github/copilot-instructions.md`.

---

## 9) Troubleshooting

- **Pipeline hangs after tests**: ensure the job or agent **did not call `show-report`** and that `PLAYWRIGHT_HTML_OPEN=never` is set. See community posts about the blocking behavior. ([Stack Overflow][5])
- **Ports in Codespaces**: use the forwarded link, not `localhost`; Codespaces manages access and visibility. ([playwright.dev][2])
- **Slow CI**: install only needed browsers locally during dev (e.g., Chromium), all on CI; cache npm with `setup-node`. ([GitHub][8])

---

## 10) Potential risks to look out for

- **HTML report expectations**: Teams often want a clickable report; uploading the static folder is safe, but people may still run `show-report` locally. Document clearly that `show-report` is **human-only**, never in CI/agents. ([playwright.dev][1])
- **Noise from GH annotations**: With large matrices, the `github` reporter can flood PRs. Consider using `dot` + JSON/JUnit for PR checks and keep HTML as an artifact for deeper inspection. ([playwright.dev][1])
- **Security**: UI Mode and HTML/trace reports can include sensitive data. In Codespaces, ports are private by default, but review visibility and sanitize artifacts before sharing. ([playwright.dev][2])

[1]: https://playwright.dev/docs/test-reporters 'Reporters | Playwright'
[2]: https://playwright.dev/docs/test-ui-mode?utm_source=chatgpt.com 'UI Mode'
[3]: https://playwright.dev/docs/test-configuration?utm_source=chatgpt.com 'Test configuration'
[4]: https://playwright.dev/docs/test-cli?utm_source=chatgpt.com 'Command line'
[5]: https://stackoverflow.com/questions/76868048/how-to-finish-running-playwright-tests-in-pipeline?utm_source=chatgpt.com 'How to finish running playwright tests in pipeline?'
[6]: https://github.com/microsoft/playwright-github-action?utm_source=chatgpt.com 'microsoft/playwright-github-action'
[7]: https://playwright.dev/docs/ci?utm_source=chatgpt.com 'Continuous Integration'
[8]: https://github.com/actions/setup-node?utm_source=chatgpt.com 'actions/setup-node'
[9]: https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs?utm_source=chatgpt.com 'Building and testing Node.js - GitHub Actions'
[10]: https://playwright.dev/docs/ci-intro?utm_source=chatgpt.com 'Setting up CI'
[11]: https://github.com/nitya/playwright-learn-codespaces-nn/?utm_source=chatgpt.com 'nitya/playwright-learn-codespaces-nn'
[12]: https://code.visualstudio.com/docs/copilot/chat/mcp-servers?utm_source=chatgpt.com 'Use MCP servers in VS Code'
[13]: https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp?utm_source=chatgpt.com 'Enhancing GitHub Copilot agent mode with MCP'
[14]: https://github.com/microsoft/playwright-mcp?utm_source=chatgpt.com 'microsoft/playwright-mcp: Playwright MCP server'
[15]: https://code.visualstudio.com/docs/copilot/customization/mcp-servers?utm_source=chatgpt.com 'Use MCP servers in VS Code'
