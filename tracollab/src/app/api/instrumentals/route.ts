import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Récupérer toutes les instrumentales de la base de données
        const instrumentals = await prisma.instrumental.findMany({
            include: {
                sound: true,
            },
        });

        // Retourner les instrumentales en tant que réponse
        return new NextResponse(JSON.stringify(instrumentals), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response,
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
