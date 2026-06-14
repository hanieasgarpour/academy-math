FROM node:22-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Copy prisma schema and switch to PostgreSQL
COPY prisma ./prisma/
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Switch to PostgreSQL again (in case COPY overwrote our change)
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Set a dummy DATABASE_URL for build time so Prisma doesn't fail during static generation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma client and build
RUN npx prisma generate && npx next build

EXPOSE 3000

# Unset the dummy DATABASE_URL - Railway will provide the real one at runtime
ENV DATABASE_URL=""

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma migrate deploy && node server.js
