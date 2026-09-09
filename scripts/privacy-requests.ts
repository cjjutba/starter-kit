import { config } from "dotenv";

// Lists open deletion requests, oldest first, or marks one handled:
// pnpm privacy:requests, or pnpm privacy:requests --done <id>.

config({ path: ".env.local", quiet: true });

async function main() {
  const { listOpenPrivacyRequests, markPrivacyRequestDone } = await import("../src/lib/db/privacy-requests");
  const [flag, id] = process.argv.slice(2);

  if (flag === "--done") {
    if (!id) throw new Error("Give the id: pnpm privacy:requests --done <id>");
    const done = await markPrivacyRequestDone(id);
    console.log(done ? `Marked ${id} handled.` : `No request with id ${id}.`);
    return;
  }

  const rows = await listOpenPrivacyRequests();
  if (rows.length === 0) {
    console.log("No open deletion requests.");
    return;
  }
  for (const row of rows) {
    console.log(`--- ${row.createdAt.toISOString()}  ${row.id}`);
    console.log(row.email);
    if (row.message) console.log(row.message);
    console.log("");
  }
  console.log(`${rows.length} open. Mark one handled with: pnpm privacy:requests --done <id>`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
