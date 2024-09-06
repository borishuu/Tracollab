import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    instrumental: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

describe('GET /api/instrumentals', () => {
  const prisma = new PrismaClient();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return instrumentals successfully', async () => {
    const mockInstrumentals = [
      {
        id: '1',
        name: 'Instrumental 1',
        sound: { genre: 'Rock' },
      },
      {
        id: '2',
        name: 'Instrumental 2',
        sound: { genre: 'Jazz' },
      },
    ];

    (prisma.instrumental.findMany as jest.Mock).mockResolvedValue(mockInstrumentals);

    await testApiHandler({
        appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'GET',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(mockInstrumentals);
        expect(prisma.$disconnect).toHaveBeenCalled();
      },
    });
  });
});
