# Use official Playwright image with browsers
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining project files
COPY . .

# Default command
CMD ["npx", "playwright", "test"]
