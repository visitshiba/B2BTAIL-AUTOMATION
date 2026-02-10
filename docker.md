# Docker Implementation Guide

## Overview

This Playwright automation framework is containerized using Docker, allowing consistent test execution across different environments (local, CI/CD pipelines, cloud platforms). Docker ensures all tests run in an isolated, reproducible environment with all dependencies pre-installed.

## Docker Architecture

### Base Image
- **Image:** `mcr.microsoft.com/playwright:v1.57.0-jammy`
- **OS:** Ubuntu Jammy (Ubuntu 22.04 LTS)
- **Pre-installed:** Playwright browsers (Chromium, Firefox, WebKit), Node.js, and all required system dependencies

### Dockerfile Structure

The `Dockerfile` follows Docker best practices:

1. **Layer 1:** Base Playwright image with browsers
2. **Layer 2:** Set working directory to `/app`
3. **Layer 3:** Copy `package.json` and `package-lock.json` (optimized for layer caching)
4. **Layer 4:** Install npm dependencies using `npm ci`
5. **Layer 5:** Copy remaining project files
6. **Layer 6:** Pre-create `/app/test-results` with proper permissions (777)
7. **Layer 7:** Set environment variable for Playwright JSON output
8. **Default Command:** Run Playwright tests with list and JSON reporters

## Prerequisites

### Local Machine
- **Docker Desktop** installed and running
  - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) (with WSL 2)
  - macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: Docker Engine and Docker Compose
- **Node.js** (LTS 16+) - for running npm scripts
- **Git** (for cloning the repository)

### System Requirements
- Minimum 4GB RAM for Docker
- At least 2GB disk space for Docker images and containers
- Stable internet connection for initial image build

## Building the Docker Image

### Build Command

```bash
npm run docker:build
```

This executes:
```bash
docker build --no-cache -t b2btail-playwright .
```

**Flags:**
- `--no-cache`: Rebuilds all layers (ignores cached layers)
- `-t b2btail-playwright`: Tags the image as `b2btail-playwright:latest`

### Build Output
Once completed successfully, you can verify the image:
```bash
docker images | grep b2btail-playwright
```

You should see the image listed with its tag, size, and creation time.

## Running Tests in Docker

### 1. Standard Test Execution

Run the entire test suite in Docker with one instance:

```bash
npm run docker:test
```

**What it does:**
- Runs all Playwright tests in a Docker container
- Mounts your local `playwright-report` directory to capture results
- Automatically removes the container after execution (`--rm`)
- Returns exit code based on test success/failure

**Equivalent command:**
```bash
docker run --rm -v %cd%/playwright-report:/app/playwright-report b2btail-playwright
```

### 2. Sharded (Distributed) Test Execution

For faster parallel execution, split tests across multiple Docker containers based on shard count:

```bash
npm run docker:test:shard
```

**What it does:**
- Cleans previous reports
- Reads environment variables (especially `SHARD_COUNT`)
- Automatically distributes tests across specified number of shards
- Each shard runs in its own Docker container
- Merges all results into a single HTML report

**Requirements:**
- `.env` file must contain `SHARD_COUNT` variable
- Example: `SHARD_COUNT=4` distributes tests across 4 parallel containers

### 3. Manual Docker Run Command

For advanced usage, run Docker directly:

```bash
# Basic run
docker run --rm -t b2btail-playwright

# With mounted volume for reports
docker run --rm -v %cd%/playwright-report:/app/playwright-report b2btail-playwright

# With custom environment variables
docker run --rm -e HEADED=true -v %cd%/playwright-report:/app/playwright-report b2btail-playwright

# Interactive mode (useful for debugging)
docker run --rm -it b2btail-playwright /bin/bash
```

**Key docker run flags:**
- `--rm`: Automatically delete container after exit
- `-v`: Mount volume (maps local directory to container directory)
- `-e`: Pass environment variables
- `-t`: Allocate pseudo-terminal
- `-it`: Interactive terminal (for debugging)

## Environment Variables

Configure test execution through environment variables in `.env` file:

```env
# Number of shards for parallel execution
SHARD_COUNT=4

# Run in headed mode (show browser window)
HEADED=false

# Base URL for tests
BASE_URL=https://automationexercise.com/

# Timeout settings
TIMEOUT=30000

# Workers per shard
WORKERS=2
```

When using Docker, pass these via the `-e` flag:
```bash
docker run --rm -e SHARD_COUNT=4 -e HEADED=false b2btail-playwright
```

## Docker Volumes & Output Management

### Mounted Directories

The framework uses volume mounts to persist test results on your local machine:

```
Host Machine              Docker Container
/playwright-report/  →    /app/playwright-report/
/allure-results/     →    /app/allure-results/
/test-results/       →    /app/test-results/
```

### Running with Result Volumes

```bash
# Mount all output directories
docker run --rm \
  -v %cd%/playwright-report:/app/playwright-report \
  -v %cd%/allure-results:/app/allure-results \
  -v %cd%/test-results:/app/test-results \
  b2btail-playwright
```

### Accessing Results After Tests

After tests complete:

1. **Playwright HTML Report:**
   ```bash
   npm run report
   ```

2. **Allure Report:**
   ```bash
   npm run report:allure:gen
   npm run report:allure
   ```

3. **View blob reports:**
   ```bash
   npm run report:merge
   ```

## Cleanup Commands

### Remove Containers
```bash
# Stop and remove all stopped containers
docker container prune

# Remove specific container
docker rm <container_id>
```

### Remove Images
```bash
# Remove Docker image
docker rmi b2btail-playwright

# Remove dangling images
docker image prune
```

### Clean Local Reports
```bash
npm run clean:reports
```

This removes local test results while preserving Docker images.

## Troubleshooting

### Issue: "Docker daemon is not running"
**Solution:** Start Docker Desktop or Docker Engine service

### Issue: "Cannot mount volume - permission denied"
**Solution:** 
- Windows: Ensure your project folder is added to Docker Desktop's shared drives
- Linux: Run `sudo` or add user to docker group: `sudo usermod -aG docker $USER`

### Issue: "No space left on device"
**Solution:** Clean up Docker resources:
```bash
docker system prune -a
```

### Issue: Tests timeout in Docker
**Solution:** 
- Increase Docker memory: Settings → Resources → Memory (set to 4GB+)
- Increase test timeout in `playwright.config.ts`

### Issue: Browser crashes in container
**Solution:** Add extended launch arguments:
```bash
docker run --rm --ipc=host b2btail-playwright
```

### Issue: Need to debug tests in Docker
**Solution:** Use interactive shell:
```bash
docker run --rm -it b2btail-playwright /bin/bash
cd /app
npx playwright test --debug
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build Docker image
  run: npm run docker:build

- name: Run tests in Docker
  run: npm run docker:test

- name: Upload reports
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: playwright-report
    path: playwright-report/
```

### Jenkins Example
In your `Jenkinsfile`, use the Docker plugin or shell stage:
```groovy
stage('Test in Docker') {
    steps {
        sh 'npm run docker:build'
        sh 'npm run docker:test'
    }
}
```

## Best Practices

1. **Always rebuild image after dependency changes:**
   ```bash
   npm install
   npm run docker:build
   ```

2. **Use sharding for large test suites** (50+ tests):
   ```bash
   npm run docker:test:shard
   ```

3. **Mount volumes persistently** to avoid losing test reports

4. **Use `.dockerignore`** to exclude unnecessary files (similar to `.gitignore`)

5. **Monitor Docker resource usage:**
   ```bash
   docker stats
   ```

6. **Tag images for version control:**
   ```bash
   docker build -t b2btail-playwright:v1.0 .
   ```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run docker:build` | Build Docker image |
| `npm run docker:test` | Run full test suite in Docker |
| `npm run docker:test:shard` | Run tests in parallel shards |
| `npm run clean:reports` | Clean local test reports |
| `npm run report` | View Playwright HTML report |
| `npm run report:allure:gen` | Generate Allure report |
| `docker images` | List all images |
| `docker ps -a` | List all containers |
| `docker logs <container_id>` | View container logs |

## Additional Resources

- [Playwright Docker Documentation](https://playwright.dev/docs/docker)
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Allure Reporting Documentation](https://docs.qameta.io/allure/)



