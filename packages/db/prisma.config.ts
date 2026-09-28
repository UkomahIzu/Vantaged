import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load root .env and .env.local files
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For migrations & CLI operations, use DIRECT_URL (direct connection, port 5432) if defined;
    // otherwise fallback to DATABASE_URL
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
