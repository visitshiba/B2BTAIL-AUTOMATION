// // require('dotenv').config();
// const config = require('../config/config').default;

// const { spawn, execSync } = require('child_process');
// const path = require('path');

// const workers = process.env.WORKERS || '100%';
// const totalShards = config.ci.totalShards;

// const projectRoot = process.cwd();
// const playwrightReportPath = path.join(projectRoot, 'playwright-report');
// const allureResultsPath = path.join(projectRoot, 'allure-results');
// const blobReportPath = path.join(projectRoot, 'blob-report');

// console.log(`Workers: ${workers}`);
// console.log(`Total Shards: ${totalShards}`);

// let hasFailure = false;
// const shardPromises = [];

// for (let i = 1; i <= totalShards; i++) {
//   console.log(`Starting shard ${i}/${totalShards}`);

//   const args = [
//     'run',
//     '--rm',
//     '-v', `${playwrightReportPath}:/app/playwright-report`,
//     '-v', `${allureResultsPath}:/app/allure-results`,
//     '-v', `${blobReportPath}:/app/blob-report`,
//     'b2btail-playwright',
//     'npx',
//     'playwright',
//     'test',
//     `--workers=${workers}`,
//     `--shard=${i}/${totalShards}`
//   ];

//   const promise = new Promise((resolve) => {
//     const child = spawn('docker', args, { stdio: 'inherit' });

//     child.on('exit', (code) => {
//       if (code !== 0) {
//         hasFailure = true;
//       }
//       resolve();
//     });
//   });

//   shardPromises.push(promise);
// }

// Promise.all(shardPromises).then(() => {
//   console.log('All shards finished.');

//   try {
//     console.log('Merging Playwright reports...');
//     execSync('npx playwright merge-reports ./blob-report', {
//       stdio: 'inherit'
//     });

//     console.log('Generating Allure report...');
//     execSync('allure generate allure-results --clean -o allure-report', {
//       stdio: 'inherit'
//     });
//   } catch (err) {
//     console.error('Error during report generation');
//     process.exit(1);
//   }

//   if (hasFailure) {
//     console.error('One or more shards failed.');
//     process.exit(1);
//   } else {
//     console.log('All shards completed successfully.');
//     process.exit(0);
//   }
// });
