import { randomUUID } from "crypto";
import {
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { lifecycleDates } from "./utils";
import { BRANDS, CONDITIONS, STORAGE_TYPE } from "@/config/constants";
import { relations } from "drizzle-orm";
import { productVariants } from "./variants";
import { productTags } from "./tags";

export const productStatus = ["active", "draft", "archived"];
// export const operatingSystems = ["window", "macos"];
export const productBrands = BRANDS.map((b) => b.value);
export const productStorageType = STORAGE_TYPE.map((s) => s.value);
export const productConditions = CONDITIONS.map((c) => c.value);

export const products = sqliteTable(
  "products",
  {
    id: text("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    images: text("images", { mode: "json" }).default(null),
    // categoryId: text("category_id")
    //   .references(() => categories.id, { onDelete: "cascade" })
    //   .notNull(),
    // subcategoryId: text("subcategory_id").references(() => subcategories.id, {
    //   onDelete: "cascade",
    // }),
    price: real("price").notNull().default(0),
    originalPrice: real("original_price").default(0),
    // operatingSystem: text("operating_system", { enum: operatingSystems }),
    inventory: integer("inventory").notNull().default(0),
    rating: integer("rating").notNull().default(0),
    status: text("status", { enum: productStatus }).notNull().default("active"),
    model: text("text").notNull(),
    //! since i will use this column in filtering how aboutindexing
    brand: text("brand", { enum: productBrands }).notNull(),
    condition: text("condition", { enum: productConditions }).notNull(),
    //! change these to number not text
    generation: text("generation"),
    ram: text("ram"),
    storage: text("storage"),
    storageType: text("storage_type", { enum: productStorageType }),
    ...lifecycleDates,
  }
  // (table) => ({
  //   categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
  //   subcategoryIdIdx: index("products_subcategory_id_idx").on(
  //     table.subcategoryId
  //   ),
  // })
);

export const productsRelations = relations(products, ({ many }) => ({
  // category: one(categories, {
  //   fields: [products.categoryId],
  //   references: [categories.id],
  // }),
  // subcategory: one(subcategories, {
  //   fields: [products.subcategoryId],
  //   references: [subcategories.id],
  // }),
  variants: many(productVariants, { relationName: "productVariants" }),
  tags: many(productTags, { relationName: "productTags" }),
}));
