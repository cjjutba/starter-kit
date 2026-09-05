import { config } from "dotenv";
import { desc } from "drizzle-orm";

// Prints the most recent rows of mail_log, newest first. With
// MAIL_PROVIDER=log this is the inbox. `pnpm mail:log 20` for more rows.

config({ path: ".env.local", quiet: true });

async function main() {
  const limit = Number(process.argv[2] ?? 5);
  const { db } = await import("../src/lib/db/client");
  const { mailLog } = await import("../src/lib/db/schema");
  const rows = await db.select().from(mailLog).orderBy(desc(mailLog.createdAt)).limit(limit);
  if (rows.length === 0) {
    console.log("mail_log is empty.");
    return;
  }
  for (const row of rows) {
    console.log(`--- ${row.createdAt.toISOString()}  ${row.provider}  to ${row.to}`);
    console.log(row.subject);
    console.log("");
    console.log(row.text);
    console.log("");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
