import * as dotenv from 'dotenv';

dotenv.config();

export default async () => {
    const browserEnv = (process.env.BROWSER || 'webkit').toLowerCase();
    const headless = process.env.HEADLESS === 'true';
    const slowMoValue = process.env.SLOW_MO === 'true' ? 1000 : 0;
    const workers = process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : undefined;
    const retryCount = process.env.RETRY_COUNT ? parseInt(process.env.RETRY_COUNT, 10) : 0;

    console.log('>>> CI Configuration:');
    console.log(`>>> Using Browser: ${browserEnv}`);
    console.log(`>>> Headless: ${headless}`);
    console.log(`>>> SlowMo: ${slowMoValue}`);
    console.log(`>>> Workers: ${workers}`);
    console.log(`>>> Retries: ${retryCount}`);
};