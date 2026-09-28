import { prisma } from "./client";

async function main() {
  console.log("Connecting to Supabase via Prisma 7 & PrismaPg adapter...");
  try {
    const result = await prisma.$queryRaw<Array<{ now: Date; current_database: string; version: string }>>`
      SELECT NOW() as now, current_database(), version();
    `;
    console.log("Connection SUCCESSFUL!");
    console.log("Database:", result[0].current_database);
    console.log("Server Time:", result[0].now);
    console.log("PostgreSQL:", result[0].version.split(" on ")[0]);
  } catch (error) {
    console.error("Connection FAILED:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
