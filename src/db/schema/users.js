import { userRole } from "@/config";
import { randomUUID } from "crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accoundTypes } from "./customers";

export const AccoundTypes = ["credentials", "google"];

export const users = sqliteTable("users", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  accountType: text("account_type", { enum: AccoundTypes }).default(
    "credentials"
  ),
  email: text("email").unique(),
  phone: text("phone").unique(),
  //! make password and salt optional
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  role: integer("role").default(userRole),
});
