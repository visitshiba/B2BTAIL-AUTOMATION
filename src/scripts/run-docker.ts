import config from '../config/config';
import { spawn } from 'child_process';
import { execSync } from 'child_process';
import path from 'path';
import process from 'process';
import fs from 'fs';

const workers: number = config.playwright.workers;
const totalShards: number = config.ci.totalShards;

const projectRoot: string = process.cwd();
const playwrightReportPath: string = path.join(projectRoot, 'playwright-report');
const allureResultsPath: string = path.join(projectRoot, 'allure-results');
const blobReportPath: string = path.join(projectRoot, 'blob-report');


// CLEANUP BEFORE RUNNING
[blobReportPath, playwrightReportPath, allureResultsPath].forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Cleaning up old directory: ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
});

if (!fs.existsSync(blobReportPath)) {
    fs.mkdirSync(blobReportPath, { recursive: true });
}

console.log(`Workers: ${workers}`);
console.log(`Total Shards: ${totalShards}`);

let hasFailure = false;
const shardPromises: Promise<void>[] = [];

for (let i = 1; i <= totalShards; i++) {
    console.log(`Starting shard ${i}/${totalShards}`);
    const shardFolder = `/app/blob-report/shard-${i}`;

    const args: string[] = [
        'run',
        '--rm',
        '-v', `${playwrightReportPath}:/app/playwright-report`,
        '-v', `${allureResultsPath}:/app/allure-results`,
        // Mount the blob-report folder so shards can write to it
        '-v', `${blobReportPath.replace(/\\/g, '/')}:/app/blob-report`,
        'b2btail-playwright',
        'npx',
        'playwright',
        'test',
        `--workers=${workers}`,
        `--shard=${i}/${totalShards}`,
        '--trace=on',
        // '--reporter=blob,,allure-playwright', // CRITICAL: Must be blob to use merge-reports later
    ];

    const promise = new Promise<void>((resolve) => {
        const child = spawn('docker', args, { stdio: 'inherit' });

        child.on('exit', (code) => {
            if (code !== 0) {
                hasFailure = true;
            }
            resolve();
        });
    });

    shardPromises.push(promise);
}

Promise.all(shardPromises).then(() => {
    console.log('All shards finished.');

    try {
        console.log('Contents of blob-report before merge:');
        console.log(fs.readdirSync(blobReportPath)); // debug: should show shard-1, shard-2, ...

        console.log('Merging Playwright reports...');
        execSync('npx playwright merge-reports ./blob-report --reporter=json > results.json', { stdio: 'inherit' });
        // execSync('npx playwright merge-reports ./blob-report', { stdio: 'inherit' });

        console.log('Generating Allure report...');
        // execSync('allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
        execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });

        console.log('Generating playwright report...');
        execSync('npx playwright merge-reports ./blob-report --reporter=html', { stdio: 'inherit' });

        console.log('Report generation completed successfully.');
    } catch (err) {
        console.error('Error during report generation');
        process.exit(1);
    }

    if (hasFailure) {
        console.error('One or more shards failed.');
        process.exit(1);
    } else {
        console.log('All shards completed successfully.');
        process.exit(0);
    }
});
