# Squadium indexer — production image (Ponder + Postgres)
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install deps with a cached layer
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# App source
COPY . .

# Ponder serves GraphQL + REST on 42069
EXPOSE 42069

# `ponder start` = production indexer + API (requires external Postgres via
# DATABASE_URL; falls back to PGlite only if unset — NOT recommended in prod).
CMD ["pnpm", "start"]
