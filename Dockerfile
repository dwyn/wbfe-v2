# Build stage
FROM node:20-alpine AS builder

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/build build/
COPY --from=builder /app/package*.json ./

# Copy blog content (since you read from filesystem)
COPY --from=builder /app/src/content src/content

# Install only production dependencies
RUN npm ci --production

# Expose the port the app runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["node", "build"]
