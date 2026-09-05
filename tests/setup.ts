import { config } from "dotenv";

// Unit tests that need a real database read DATABASE_URL from .env.local
// and skip themselves when it is absent, which is what CI does.
config({ path: ".env.local", quiet: true });
