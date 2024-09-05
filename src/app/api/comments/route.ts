import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    
    const comments = await prisma.comment.findMany();
    await prisma.$disconnect();

    return new Response(JSON.stringify(comments), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}