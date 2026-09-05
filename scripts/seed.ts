import { config } from "dotenv";
import { eq } from "drizzle-orm";

// Creates one person and, through the sign up hook, their personal
// organisation. That is the whole seed. It exists so sign in works on a
// fresh database, and it does nothing on a database that already has the
// person. Real products get their data from real people.

config({ path: ".env.local", quiet: true });

async function main() {
  const email = process.env.SEED_EMAIL ?? "owner@example.com";
  const password = process.env.SEED_PASSWORD ?? "change-this-before-anyone-else-does";
  const name = process.env.SEED_NAME ?? "Owner";

  // Imported after the env file is loaded, because these modules read it.
  const { db } = await import("../src/lib/db/client");
  const { user } = await import("../src/lib/db/schema");
  const { auth } = await import("../src/lib/auth/server");

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  if (existing.length > 0) {
    console.log(`Seed: ${email} already exists. Nothing to do.`);
    return;
  }

  await auth.api.signUpEmail({ body: { name, email, password } });
  console.log(`Seed: created ${email} and a personal organisation.`);
  console.log(`Sign in with ${email} and the password from SEED_PASSWORD.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
