import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    await prisma.customers.updateMany({
      data: {
        commercialAssistantId: null,
      },
    });

    await prisma.customers.deleteMany({});

    await prisma.commercialAssistant.deleteMany({});

    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// docker-compose exec empbank npx ts-node script.ts

cleanDatabase();
