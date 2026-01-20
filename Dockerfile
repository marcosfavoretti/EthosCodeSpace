# Stage 1: Builder
FROM node:22-alpine AS builder

# Argument to specify which app to build
ARG APP_NAME

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev) for build
RUN npm ci

# Copy source code
COPY apps/ apps/
COPY libs/ libs/

# Build the specific application
RUN npx nest build ${APP_NAME}

# Remove dev dependencies before final stage copy (optional strategy, 
# but often better to just install prod deps in a clean stage or prune)
# Here we will use a separate install for prod deps to ensure cleanliness

# Stage 2: Production
FROM node:22-alpine AS production

ARG APP_NAME
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built assets from builder
# Adjust path based on how nest build outputs. 
# Standard Nest monorepo: dist/apps/<app-name>
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist

# Start the application
CMD ["node", "dist/main"]
