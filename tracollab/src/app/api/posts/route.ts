import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    
    const instrumentals = await prisma.post.findMany();
    await prisma.$disconnect();

    return new Response(JSON.stringify(instrumentals), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}