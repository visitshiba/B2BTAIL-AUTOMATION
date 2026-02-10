# Use official Playwright image with browsers
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining project files
COPY . .

# Pre-create the results folder and set permissions
# This ensures Docker doesn't create it as 'root' during execution
RUN mkdir -p /app/test-results && chmod 777 /app/test-results

# Set an environment variable to ensure Playwright knows where to output
ENV PLAYWRIGHT_JSON_OUTPUT_NAME=test-results/report.json

# Default command
CMD ["npx", "playwright", "test", "--reporter=list,json"]
