import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "dotenv";
import { products, productsRelations } from "./schema/products";
import { users } from "./schema/users";
import {
  admins,
  customers,
  productTags,
  productTagsRelations,
  productVariants,
  productVariantValues,
  tags,
  tagsRelations,
  variants,
  productVariantsRelations,
  productVariantValuesRelations,
  productOrders,
  orderRelations,
} from "./schema";

config();

const sqlite = new Database(process.env.DB_URL);

export const db = drizzle(sqlite, {
  schema: {
    products,
    productsRelations,
    productTagsRelations,
    tagsRelations,
    users,
    admins,
    customers,
    tags,
    productTags,
    variants,
    productVariants,
    productVariantValues,
    productVariantsRelations,
    productVariantValuesRelations,
    productOrders,
    orderRelations,
  },
});

migrate(db, { migrationsFolder: "src/drizzle" });
