import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
// import globalSetup from './src/lib/logger/global-setup'; // <- TypeScript import

dotenv.config();
type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Read environment variables (with safe defaults)
const browserEnv = (process.env.BROWSER || 'webkit').toLowerCase();
const headless = process.env.HEADLESS === 'true';
const slowMoValue = process.env.SLOW_MO === 'true' ? 1000 : 0;
const workers = process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : undefined;
const retryCount = process.env.RETRY_COUNT ? parseInt(process.env.RETRY_COUNT, 10) : 0;

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

console.log(`>>> Using Browser: ${browserEnv}`);
console.log(`>>> Resolved Browser: ${projects[0].use.browserName}`);
console.log(`>>> Headless: ${headless}`);
console.log(`>>> SlowMo: ${slowMoValue}`);
console.log(`>>> Workers: ${workers}`);
console.log(`>>> Retries: ${retryCount}`);

export default defineConfig({
    testDir: './src/tests',
    testMatch: '**/*.ts',
    timeout: 60 * 1000,
    globalTimeout: 600 * 1000, // 10 minutes for everything
    expect: {
        timeout: 10 * 1000,      // 10 seconds for assertions
    },
    retries: retryCount,
    workers: workers,
    reporter: [['list'], ['allure-playwright'], ['html', {
        open: 'never'  // Optional: 'always'|'never'|'on-failure'
    }]],

    fullyParallel: true,

    use: {
        headless,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15 * 1000,
        navigationTimeout: 30 * 1000, // 30s for page loads
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        launchOptions: {
            slowMo: slowMoValue,
        },
    },

    projects,
});
