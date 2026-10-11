import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import { pathToFileURL } from 'url';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prismaPromise: Promise<PrismaClient> | undefined;

async function initPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const { createClient } = await import('@libsql/client');
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  const dbUrl = pathToFileURL(dbPath).href;
  const libsql = createClient({
    url: dbUrl,
  });
  const adapter = new PrismaLibSql(libsql as any);
  const prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;
  return prisma;
}

export const getPrismaClient = () => {
  if (!prismaPromise) {
    prismaPromise = initPrisma();
  }
  return prismaPromise;
};
