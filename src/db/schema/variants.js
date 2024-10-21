import { relations } from "drizzle-orm";
import { lifecycleDates } from "./utils";
import { randomUUID } from "crypto";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { products } from "./products";

export const variants = sqliteTable("variants", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  name: text("name").unique().notNull(),
  ...lifecycleDates,
});

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id")
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    productId: text("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    variantId: text("variant_id")
      .references(() => variants.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    productIdIdx: index("product_variants_product_id_idx").on(table.productId),
    variantIdIdx: index("product_variants_variant_id_idx").on(table.variantId),
  })
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variant: one(variants, {
      fields: [productVariants.variantId],
      references: [variants.id],
    }),
    productVariantValues: many(productVariantValues),
  })
);

export const productVariantValues = sqliteTable(
  "product_variant_values",
  {
    productVariantId: text("product_variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value").notNull(),
    price: real("price").notNull(),
    //! add status
    inventory: integer("inventory").notNull().default(0),
    ...lifecycleDates,
  },
  (table) => ({
    pk: primaryKey({
      name: "product_variant_values_pk",
      columns: [table.productVariantId, table.value],
    }),
    productVariantIdIdx: index("variant_values_product_variant_id_idx").on(
      table.productVariantId
    ),
  })
);

export const productVariantValuesRelations = relations(
  productVariantValues,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [productVariantValues.productVariantId],
      references: [productVariants.id],
    }),
  })
);
