# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Install dependencies and build
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src ./src
COPY src ./src
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
