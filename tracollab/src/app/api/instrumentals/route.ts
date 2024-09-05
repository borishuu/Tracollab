import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const instrumentals = await prisma.instrumental.findMany({
            include: {
                sound: true, // Include related sound data
            },
        });

        return new Response(JSON.stringify(instrumentals), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    } catch (error) {

    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
