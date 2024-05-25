#!/bin/sh
npx prisma migrate deploy
node /app/.output/server/index.mjs