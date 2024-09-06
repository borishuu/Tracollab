import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    genre: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

describe('GET /api/genres', () => {
  const prisma = new PrismaClient();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return genres successfully', async () => {
    // Mock data
    const mockGenres = [
      { id: '1', name: 'Rock' },
      { id: '2', name: 'Jazz' },
    ];

    // Mock Prisma response
    (prisma.genre.findMany as jest.Mock).mockResolvedValue(mockGenres);

    await testApiHandler({
        appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'GET',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(mockGenres);
        expect(prisma.$disconnect).toHaveBeenCalled();
      },
    });
  });

  it('should handle errors and return a 500 status', async () => {
    // Mock Prisma to throw an error
    (prisma.genre.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    await testApiHandler({
        appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'GET',
        });

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ message: 'Internal server error' });
        expect(prisma.$disconnect).toHaveBeenCalled();
      },
    });
  });
});
