# playwright-master

## Overview
This repository contains an end-to-end test automation framework built with Playwright and TypeScript. It exercises automation scenarios for websites such as `https://automationexercise.com/` using the Page Object Model (POM) and common automation best practices.

## Why this project
- Provides a maintainable, scalable automation framework for UI tests.
- Demonstrates POM, fixtures, test data factories, and reporting (HTML / Allure).
- Useful as a template to onboard team members, run CI/CD UI checks, and validate critical flows (navigation, authentication, checkout, etc.).

## Implementation summary
- Language: TypeScript
- Test runner: Playwright Test
- Pattern: Page Object Model (POM)
- Test structure: `src/pages` (page objects) and `src/tests` (test specs)
- Test data: `src/utils/testDataFactory.ts` (faker-based factory)
- Reporting: Playwright HTML report and Allure-compatible results (`allure-results/`)
- Configuration: `playwright.config.ts` (projects, baseURL, timeouts, reporters)

## Project structure (important files / folders)
- `playwright.config.ts` — Playwright configuration (baseURL, projects, reporters, timeout)
- `package.json` — scripts and dependencies
- `README.md` — this file
- `src/`
	- `pages/` — Page Object Model classes (e.g., `navigationMenu.ts`, `homePage.ts`, `basePage.ts`, `signupPage.ts`)
	- `tests/` — Playwright test files (e.g., `navigationMenu.spec.ts`, integration specs)
	- `utils/` — helpers and data factories (e.g., `testDataFactory.ts`, `testData.ts`)
- `allure-results/` — Allure result artifacts collected by tests (if configured)
- `playwright-report/` — Playwright HTML report output (generated after running tests)
- `test-results/` — additional test outputs (if used)

## Prerequisites
- Node.js (recommend LTS >= 16.x or as required by `package.json`)
- npm (or yarn/pnpm)
- Mac/Linux/Windows supported (this repo was edited on macOS)
- Optional: Allure CLI for HTML reports (or use `npx` to run the CLI locally)

## Quickstart — install & verify
1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

(If you want only Chromium/Firefox/WebKit specifically, use `npx playwright install chromium` etc.)

3. (Optional) Install Allure CLI if you plan to generate Allure reports locally:
```bash
npm install -D allure-commandline
```

## Running tests
- Run the full test suite:
```bash
npx playwright test
```

- Run a single spec file:
```bash
npx playwright test src/tests/navigationMenu.spec.ts
```

- Run a test by title (grep):
```bash
npx playwright test -g "should open the products page"
```

- Run headed (show browser) and slow motion for debugging:
```bash
npx playwright test --headed --slow-mo 100
```

- Capture trace and video for failing tests:
```bash
npx playwright test --trace on --video retain-on-failure
```

## Viewing reports
- Playwright HTML report (generated automatically under `playwright-report/`):
```bash
npx playwright show-report
```

- Allure report (if `allure-results/` is populated and `allure-commandline` is installed):
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Notes:
- The project may already produce `allure-results/` during test runs depending on the reporter configured in `playwright.config.ts`.
- If Allure reporter is not configured, add it to `playwright.config.ts` (or use `--reporter`).

## Playwright / config tips
- Check `playwright.config.ts` for the `use.baseURL` value — tests reference this value to use relative URLs.
- Adjust timeouts and retries in the config for CI vs local development.
- Use projects in config to target different browsers or devices.

## Writing tests & POM guidelines
- Page objects live in `src/pages`. Each page class should:
	- Expose actions (methods) representing user interactions (e.g., `goToProducts()`, `openCart()`).
	- Keep selectors private; expose only meaningful methods that return domain-level results.
	- Not contain test assertions — tests assert on page object results/state.
- Tests live in `src/tests`. Keep tests readable and focused on behavior (Arrange / Act / Assert).
- Use `src/utils/testDataFactory.ts` (faker-based) to generate unique test data (emails, names).
- Naming conventions:
	- Page classes: `CamelCase` with `Page` or meaningful suffix (e.g., `HomePage`, `NavigationMenu`).
	- Test files: `*.spec.ts`
	- Test titles: clear descriptive strings, e.g., "Navigation menu opens Products page".
- Selectors:
	- Prefer data-test attributes if available (e.g., `data-test="login-button"`).
	- Use stable attributes rather than fragile text or position-based selectors.
	- Keep selectors centralized in page objects so maintenance is simpler.
- Synchronization:
	- Prefer Playwright auto-waiting, but add explicit `await page.waitForSelector()` only when necessary.
	- Use Playwright's `expect(locator).toBeVisible()` for waits/assertions where required.

## Test data & fixtures
- Use `TestDataFactory` to create user accounts and product names.
- Keep test accounts disposable or scope tests to not depend on state created by other tests.
- Consider using API calls to set up/tear down test data when available to speed tests.

## CI / Best practices
- Keep CI parallelism reasonable — flaky tests often caused by shared state.
- Run Playwright tests in a clean environment (install browsers in CI job).
- Collect traces and videos on failure for easier debugging.
- Use retries for unstable tests but prefer to fix the root cause.

## Troubleshooting
- "Element not found" — verify selector in page object; increase timeout or prefer stronger selectors.
- "Browser not installed" — run `npx playwright install`.
- Allure report missing — ensure `allure-results/` is being generated by adding the Allure reporter or running test with the reporter flag.

## Where to look next
- `src/pages/signIn.page.ts` — navigation menu POM implementation
- `src/tests/signin.spec.ts` — example tests using the navigation POM
- `src/utils/testDataFactory.ts` — faker-based test data generation

## Contributing
- Open a pull request with a clear description.
- Add/modify tests to cover new functionality.
- Keep changes focused and avoid altering unrelated files.

---

