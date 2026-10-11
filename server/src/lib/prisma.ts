import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import { pathToFileURL } from 'url';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const dbPath = path.resolve(process.cwd(), 'dev.db');
const dbUrl = pathToFileURL(dbPath).href;

const adapter = new PrismaLibSql({ url: dbUrl });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const getPrismaClient = async (): Promise<PrismaClient> => {
  return prisma;
};
