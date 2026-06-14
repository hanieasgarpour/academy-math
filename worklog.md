
---
Task ID: 1
Agent: main
Task: Fix Railway deployment build/runtime errors for math academy

Work Log:
- Read current .dockerignore (already had .env excluded ✅)
- Read current Dockerfile (had dummy DATABASE_URL ✅, but CMD used node server.js ❌)
- Read next.config.ts (had output: "standalone" which creates server.js at .next/standalone/, not at root ❌)
- Read all page.tsx files to check for missing force-dynamic (all server component pages that use DB have it ✅)
- Removed output: "standalone" from next.config.ts
- Changed CMD from "node server.js" to "npx next start" in Dockerfile
- Removed unnecessary ENV DATABASE_URL="" line from Dockerfile
- Pushed to GitHub: commit 7b0c2f5

Stage Summary:
- Root cause: output: "standalone" produces server.js at .next/standalone/server.js but Dockerfile CMD ran "node server.js" from /app (file not found at runtime)
- Fix: Removed standalone output mode, use "npx next start" instead of "node server.js"
- All changes pushed to GitHub, user needs to redeploy on Railway
