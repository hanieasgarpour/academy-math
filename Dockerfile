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

# Copy source code (.dockerignore excludes .env)
COPY . .

# Switch to PostgreSQL again (in case COPY overwrote our change)
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Set a dummy DATABASE_URL for build time only
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma client and build
RUN npx prisma generate && npx next build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma migrate deploy && npx tsx prisma/seed.ts ; npx next start
