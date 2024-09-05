import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    
    const voices = await prisma.voice.findMany();
    console.log(voices);
    await prisma.$disconnect();

    return new Response(JSON.stringify(voices), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}