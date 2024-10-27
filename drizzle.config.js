import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config();

export default defineConfig({
  schema: "./src/db/schema/index.js",
  out: "./src/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
});
