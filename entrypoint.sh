#!/bin/sh
set -e

echo "=== Starting Application ==="

# Run database migrations (non-blocking - app starts even if this fails)
echo ">>> Running database migrations..."
npx prisma migrate deploy 2>&1 || echo "WARNING: Migration failed, continuing anyway..."

# Run seed (non-blocking)
echo ">>> Running database seed..."
node prisma/seed.js 2>&1 || echo "WARNING: Seed failed, continuing anyway..."

# Start the Next.js app
echo ">>> Starting Next.js..."
exec npx next start
