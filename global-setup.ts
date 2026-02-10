import config from './src/config/config';

export default async () => {

    /**What global-setup is actually for |   → prepare data / log metadata
     * ✔ Auth setup (storageState)
        ✔ Seeding data
        ✔ Creating test users / fixture can be used as well for test user creation
        ✔ Pre-test API calls
        ✔ Environment bootstrapping that affects test data, not test execution
     */


    console.log('>>> CI Configuration:'); 
    console.log(`>>> Browser: ${config.playwright.browser}`);
    console.log(`>>> Headless: ${config.playwright.headless}`);
    console.log(`>>> SlowMo: ${config.playwright.slowMo}`);
    console.log(`>>> Workers: ${config.playwright.workers}`);
    console.log(`>>> Retries: ${config.playwright.retries}`);
};