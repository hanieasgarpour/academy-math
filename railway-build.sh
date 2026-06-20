#!/bin/bash
# Railway build script
# This script switches the Prisma schema from SQLite to PostgreSQL for Railway deployment

echo "🚂 Preparing for Railway deployment..."

# Replace SQLite with PostgreSQL in schema.prisma
sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "✅ Schema switched to PostgreSQL"
echo "📦 Running prisma generate..."
npx prisma generate

echo "📦 Running prisma migrate deploy..."
npx prisma migrate deploy

echo "🏗️  Building Next.js..."
next build

echo "✅ Build complete!"
