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

# Dummy DATABASE_URL for build-time Prisma validation and Next.js prerendering.
# The real DATABASE_URL is injected by Railway at runtime.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client and build
RUN npx prisma generate && npx next build

# Unset the dummy DATABASE_URL so the runtime value from Railway takes effect
ENV DATABASE_URL=""

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma migrate deploy && node server.js
