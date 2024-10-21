import { config } from "dotenv";
config();

export default {
  schema: "./src/db/schema/index.js",
  out: "./src/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL,
  },
};
