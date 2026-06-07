// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default prisma;




import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // ডিবাগ করার জন্য এটা বেশ হেল্পফুল
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;