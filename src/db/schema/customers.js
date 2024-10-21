import { randomUUID } from "crypto";
import { users } from "./users";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { integer } from "drizzle-orm/pg-core";
import { lifecycleDates } from "./utils";

export const accoundTypes = ["google", "phone"];
export const customers = sqliteTable("customers", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  emailVerified: integer("email_verified").default(0),
  telegram: text("telegram").unique(),
  ...lifecycleDates,
});
