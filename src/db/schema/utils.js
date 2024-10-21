import { integer } from "drizzle-orm/sqlite-core";

export const lifecycleDates = {
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at")
    .$defaultFn(() => Date.now())
    .$onUpdate(() => Date.now()),
};
