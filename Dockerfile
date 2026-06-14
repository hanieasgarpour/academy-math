FROM node:22-slim AS base

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ---- Dependencies stage ----
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

# ---- Build stage ----
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Switch Prisma from SQLite to PostgreSQL for production
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Generate Prisma Client with PostgreSQL provider
RUN npx prisma generate

# Build Next.js
RUN npx next build

# ---- Production stage ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy prisma engine binaries
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm 2>/dev/null || true

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
