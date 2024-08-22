/*import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();*/

export async function GET(req: Request) {
    return new Response(JSON.stringify({ message: 'Hello, world!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}