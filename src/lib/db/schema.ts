import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

// The application schema. Auth tables come from ./auth-schema.ts, which the
// Better Auth CLI generates; do not edit that file by hand. Every timestamp
// is timestamptz. Every tenant table carries organisation_id and is listed
// in ./tables.ts, where a test checks it.

export * from "./auth-schema";

/** The example tenant table. Replace it with the product's first real one. */
export const notes = pgTable(
  "notes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organisationId: text("organisation_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("notes_organisation_created_idx").on(table.organisationId, table.createdAt)],
);

/** Fixed window counters for public endpoints. Shared, keyed by scope and IP. */
export const rateLimits = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
});

/** Every message the app tried to send, whichever provider handled it. */
export const mailLog = pgTable("mail_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  text: text("text").notNull(),
  html: text("html"),
  provider: text("provider").notNull(),
  providerId: text("provider_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
