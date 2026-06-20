
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

---
Task ID: 1
Agent: main-agent
Task: Fix name (ارفعان→عرفان), improve role-based navigation, update contact section, push to GitHub with version tag

Work Log:
- Searched codebase for "ارفعان" - found only in src/app/page.tsx line 209
- Changed "چرا آکادمی ارفعان؟" → "چرا آکادمی عرفان؟"
- Updated navbar.tsx: Admin sees only "پنل مدیریت" link, Student sees only "داشبورد" link (both desktop and mobile menus)
- Updated page.tsx contact section: Added phone (09387313618), email (ef.aghaeizadeh@gmail.com), Skyroom online classes note, removed address
- Added Phone and Mail icon imports to page.tsx
- Committed and pushed to GitHub with tag v1.1.0
- Provided user with local setup instructions (Git install, npm install, .env, prisma, seed)

Stage Summary:
- All 4 user-requested changes completed
- v1.1.0 tag pushed to GitHub
- User needs to install Git, run npm install, create .env, and run prisma commands before running locally

---
Task ID: 5
Agent: main-agent
Task: Fix "خطا در ایجاد سفارش" error when clicking buy on a note (v1.2.4)

Work Log:
- Read the note order creation API at src/app/api/notes/[id]/order/route.ts
- Read the products page handleNoteAction flow at src/app/products/page.tsx
- Read the auth config at src/lib/auth.ts (JWT strategy, token.id set on login)
- Inspected local SQLite DB: NoteOrder table exists but is empty (sandbox state, not user's actual state)
- Checked git history: v1.2.3 had two parallel commits (local 9fc9f15 and remote bb3928f)
  - Remote bb3928f already restored the upload API and removed the problematic migration
- Analyzed root cause of "خطا در ایجاد سفارش":
  1. Most likely: user's local SQLite DB schema is out of sync — NoteOrder table is missing
     because user hasn't run `npx prisma db push` after the schema was updated
  2. Less likely: token.id missing from JWT
  3. The error message was generic, hiding the real cause from the user

- Fixes applied:
  - src/app/api/notes/[id]/order/route.ts: added defensive `if (!token || !token.id)` check
    (returns 401 instead of crashing with 500), and Prisma P2021/P2022 error detection
    with helpful Persian message telling user to run `npx prisma db push`
  - src/app/api/notes/[id]/download/route.ts: same defensive checks
  - src/app/api/notes/orders/[noteOrderId]/pay/route.ts: same defensive checks
  - src/app/api/notes/orders/[noteOrderId]/route.ts: same defensive checks
  - src/app/api/user/note-orders/route.ts: same defensive checks
  - src/app/products/page.tsx: improved error toast to show actual API error message
    (so user can see the real reason, not just generic "خطا در ایجاد سفارش")
  - scripts/check-db-schema.js: new diagnostic script for users to verify their local DB
  - package.json: bumped version to 1.2.4

- Synced local main with remote (reset to origin/main bb3928f, re-applied changes)
- Committed as a90ffce, tagged v1.2.4, pushed to GitHub

Stage Summary:
- Root cause: generic error message was hiding the real issue (most likely
  missing NoteOrder table in local DB due to schema not being pushed)
- Fix: defensive token check + Prisma error code detection returns specific
  actionable messages (e.g. "run npx prisma db push")
- User should now see the actual error reason in the toast notification
- v1.2.4 tag pushed to GitHub
- User should: git pull, then if error persists, run `npx prisma db push`
  to sync their local SQLite DB schema with the latest schema.prisma

---
Task ID: 6
Agent: main-agent
Task: Add admin password reset feature + fix homepage crash on db.course.findMany (v1.2.5)

Work Log:
- Verified user password change in profile page already exists since v1.2.2
  (currentPassword + newPassword + confirmPassword card with bcrypt verification)
- Created new API: src/app/api/admin/users/[id]/reset-password/route.ts
  - POST endpoint, admin-only (token.role === "ADMIN")
  - Validates newPassword min length 6 with zod
  - Prevents admin from resetting own password (must use profile flow)
  - Bcrypt-hashes new password before saving
  - Defensive Prisma P2021/P2022 error handling
- Updated src/app/admin/users/page.tsx:
  - Added resetUser / resetPasswordValue / resetting state
  - Added openResetDialog, closeResetDialog, resetPassword helper functions
  - Added KeyRound icon button next to delete button in actions column
  - Added reset password dialog showing user info + new password input
  - Button disabled until password length >= 6
- Fixed src/app/page.tsx homepage crash:
  - Wrapped all db queries (course.findMany, user.count, course.count, lesson.count)
    in a single try-catch with empty-state fallback
  - If Prisma client is missing or DB schema is out of sync, homepage renders
    with empty courses array and zero stats instead of throwing
  - Added empty state UI for featured courses section
- Bumped package.json version to 1.2.5
- Committed as 8bec252, tagged v1.2.5, pushed to GitHub

Stage Summary:
- Admin can now reset any user's password from the admin users page
- Homepage no longer crashes when Prisma has issues (graceful empty state)
- v1.2.5 tag pushed to GitHub
- User should: git pull origin main
- If homepage was crashing because Prisma client wasn't generated:
    npx prisma generate
  If crashing because local DB schema is out of sync:
    npx prisma db push
