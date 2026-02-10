import { defineConfig } from '@playwright/test';
import config from './src/config/config';
import path from 'path';
type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Read environment variables (with safe defaults)
const browserEnv = config.playwright.browser;
const headless = config.playwright.headless;
const slowMoValue = config.playwright.slowMo;
const workers = config.playwright.workers;
const retryCount = config.playwright.retries
const projectRoot = process.cwd();


// Normalize browser names
function getBrowserName(name: string): BrowserName {
    switch (name) {
        case 'chrome':
        case 'chromium':
            return 'chromium';

        case 'firefox':
            return 'firefox';

        case 'webkit':
            return 'webkit';

        default:
            return 'webkit';
    }
}

// Build projects list based on BROWSER env
let projects: { name: string; use: { browserName: BrowserName } }[] = [];

if (browserEnv === 'all') {
    projects = ['chromium', 'firefox', 'webkit'].map((b) => ({
        name: b,
        use: { browserName: b as BrowserName },
    }));
} else {
    const b = getBrowserName(browserEnv);
    projects = [{ name: b, use: { browserName: b } }];
}

export default defineConfig({
    testDir: './src/tests',
    testMatch: '**/*.ts',
    timeout: 60 * 1000,
    globalTimeout: 600 * 1000, // 10 minutes for everything
    expect: {
        timeout: 30 * 1000,      // 10 seconds for assertions
    },
    retries: retryCount,
    workers: workers,
    reporter: [['list'], ['allure-playwright', { outputFolder: 'allure-results' }], ['html', {
        open: 'never'  // Optional: 'always'|'never'|'on-failure'
    }], ['json', { outputFile: 'test-results/report.json' }] ,['blob'] ],

    fullyParallel: true,

    use: {
        headless,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 30 * 1000,
        navigationTimeout: 30 * 1000, // 30s for page loads
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        launchOptions: {
            slowMo: slowMoValue,
        },
    },
    projects,
    globalSetup: require.resolve('./global-setup'),
    outputDir: '/app/blob-report', // ensures all shards write to blob-report


});
