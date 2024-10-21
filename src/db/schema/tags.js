import { randomUUID } from "crypto";
import { lifecycleDates } from "./utils";
import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const tags = sqliteTable("tags", {
  id: text("id", { length: 36 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("blue"),
  ...lifecycleDates,
});

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(products, {
    relationName: "productTags",
  }),
}));

export const productTags = sqliteTable(
  "product_tags",
  {
    productId: text("product_id", { length: 36 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    tagId: text("tag_id", { length: 36 })
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    pk: primaryKey({
      name: "product_tags_pk",
      columns: [table.productId, table.tagId],
    }),
    productTagIdx: index("product_tags_product_id_tag_id_idx").on(
      table.productId,
      table.tagId
    ),
  })
);

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
    relationName: "productTags",
  }),
  tag: one(tags, { fields: [productTags.tagId], references: [tags.id] }),
}));
