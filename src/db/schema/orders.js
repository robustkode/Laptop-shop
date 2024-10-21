import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { lifecycleDates } from "./utils";
import { randomUUID } from "crypto";
import { products } from "./products";
import { productVariants, productVariantValues } from "./variants";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const orderStatus = ["new", "completed"];
//! change name to orders
export const productOrders = sqliteTable(
  "product_orders",
  {
    id: text("id", { length: 36 })
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    //! ondelete think
    productId: text("product_id", { length: 36 })
      .references(() => products.id)
      .notNull(),
    //! ondelete think
    productVariantId: text("product_variant_id", { length: 36 }).references(
      () => productVariants.id
    ),
    price: real("price").notNull(),
    value: text("value"),
    variantName: text("variant_name"),
    quantity: integer("quantity").notNull().default(1),
    ...lifecycleDates,
    //! fix the query and delete this column
    createdDay: text("created_day").$defaultFn(() => {
      const now = new Date();
      return now.toISOString().split("T")[0];
    }),
    //! add notNull()
    userId: text("user_id", { length: 36 }).references(() => users.id),
    //! add notNull()
    status: text("status", { enum: orderStatus }).default("new"),
  },
  //   (table) => ({
  //     storeIdIdx: index("orders_store_id_idx").on(table.storeId),
  //     addressIdIdx: index("orders_address_id_idx").on(table.addressId),
  //   })
  (table) => ({
    productIdIdx: index("orders_product_id_idx").on(table.productId),
    productVariantIdIdx: index("orders_product_variant_id_idx").on(
      table.productVariantId
    ),
  })
);

export const orderRelations = relations(productOrders, ({ one }) => ({
  product: one(products, {
    fields: [productOrders.productId],
    references: [products.id],
  }),
  productVariantValues: one(productVariantValues, {
    fields: [productOrders.productVariantId, productOrders.value],
    references: [
      productVariantValues.productVariantId,
      productVariantValues.value,
    ],
  }),
}));
