#!/bin/sh
mkdir -p /app/upload
npx prisma migrate deploy
node /app/.output/server/index.mjs