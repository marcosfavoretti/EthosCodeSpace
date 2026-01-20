# Stage 1: Builder
FROM node:lts-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including devDependencies for building
# If you are using npm, change 'pnpm install' to 'npm install'
RUN npm install

# Copy the entire project
COPY . .

# Build all applications and libraries
# This assumes 'nest build' compiles everything into the 'dist' directory
RUN npm run build

# Stage 2: Runner
FROM node:lts-alpine as runner

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/package*.json ./
# If you are using npm, change 'pnpm install --prod' to 'npm install --prod'
RUN npm install --prod --omit=dev

# Copy the built applications and libraries from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your NestJS application listens on
EXPOSE 3000

# Define the command to run the application
# Use APP_NAME environment variable to specify which app to run
# Example: docker run -p 3000:3000 -e APP_NAME=app-ethos your-image-name
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/${APP_ENTRY_FILE}"]

# Default environment variable for APP_NAME (optional, can be overridden)
ENV APP_NAME=app-ethos
ENV APP_ENTRY_FILE=main.js