/** Clean Allure Reports and Results Folder */

import fs from 'fs';
import path from 'path';

const paths = ['allure-results', 'allure-report'];

paths.forEach(dir => {
  const fullPath = path.resolve(process.cwd(), dir);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✔ Cleaned ${dir}`);
  }
});
