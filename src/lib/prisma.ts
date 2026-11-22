import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

let isDatabaseConnected: boolean | null = null;

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }
  if (isDatabaseConnected !== null) {
    return isDatabaseConnected;
  }
  try {
    // Quick test query to verify PostgreSQL / Neon connection
    await prisma.$queryRaw`SELECT 1`;
    isDatabaseConnected = true;
    console.log("[OneAtlas DB] Successfully connected to PostgreSQL / Neon database.");
    return true;
  } catch (error) {
    console.warn("[OneAtlas DB] Could not connect to PostgreSQL. Operating with integrated seed cache.");
    isDatabaseConnected = false;
    return false;
  }
}
