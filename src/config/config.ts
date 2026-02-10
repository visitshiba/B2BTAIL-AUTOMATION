import * as dotenv from 'dotenv';

// Load env file based on TEST_ENV (default to dev)
dotenv.config({ path: `.env.${process.env.TEST_ENV || 'dev'}` });

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Define all env variables in a single object
const config = {
  // App-level config
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  // apiKey: process.env.API_KEY || '',

  // db: {
  //   user: process.env.DB_USER || '',
  //   password: process.env.DB_PASS || '',
  //   host: process.env.DB_HOST || '',
  // },

  // timeouts: {
  //   test: parseInt(process.env.TEST_TIMEOUT || '60000', 10),
  //   global: parseInt(process.env.GLOBAL_TIMEOUT || '1200000', 10),
  // },

  // featureFlags: {
  //   newUI: process.env.FEATURE_NEW_UI === 'true',
  // },

  // Playwright-specific config (test infrastructure)
  playwright: {
    browser: (process.env.BROWSER || 'webkit').toLowerCase() as BrowserName | 'all',
    headless: process.env.HEADLESS === 'true',
    slowMo: process.env.SLOW_MO === 'true' ? 1000 : 0,
    workers: process.env.WORKERS ? Number(process.env.WORKERS) : 1,
    retries: process.env.RETRY_COUNT ? Number(process.env.RETRY_COUNT) : 0,
  },
  ci:{
    totalShards: parseInt(process.env.TOTAL_SHARDS || '1', 10),
  }
};



export default config;
