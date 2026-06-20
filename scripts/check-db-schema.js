// Diagnostic script: checks if the local SQLite DB has the NoteOrder table
// and that Prisma can connect successfully.
// Usage: node scripts/check-db-schema.js
const { PrismaClient } = require("@prisma/client");

(async () => {
  const db = new PrismaClient();
  let ok = true;
  try {
    console.log("1. Testing DB connection...");
    await db.$connect();
    console.log("   ✓ Connected.");

    console.log("2. Checking Note table...");
    const noteCount = await db.note.count();
    console.log(`   ✓ Note table exists. Rows: ${noteCount}`);

    console.log("3. Checking NoteOrder table...");
    const noteOrderCount = await db.noteOrder.count();
    console.log(`   ✓ NoteOrder table exists. Rows: ${noteOrderCount}`);

    console.log("4. Checking User table...");
    const userCount = await db.user.count();
    console.log(`   ✓ User table exists. Rows: ${userCount}`);

    console.log("\n✅ All checks passed. Database schema is up-to-date.");
  } catch (e) {
    ok = false;
    console.error("\n❌ Database check failed:", e.message);
    if (e.code === "P2021") {
      console.error(
        "\nThe NoteOrder table is missing from your local DB.\n" +
        "Run this command to fix:\n" +
        "  npx prisma db push\n"
      );
    } else if (e.code === "P2022") {
      console.error(
        "\nSome column is missing from your local DB.\n" +
        "Run this command to fix:\n" +
        "  npx prisma db push\n"
      );
    } else if (e.message && e.message.includes("does not exist")) {
      console.error(
        "\nYour local DB schema is out of sync with prisma/schema.prisma.\n" +
        "Run this command to fix:\n" +
        "  npx prisma db push\n"
      );
    }
  } finally {
    await db.$disconnect();
    process.exit(ok ? 0 : 1);
  }
})();
