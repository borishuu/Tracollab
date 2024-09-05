import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Récupérer tous les genres de la base de données
        const genres = await prisma.genre.findMany();

        // Retourner les genres en tant que réponse
        return new NextResponse(JSON.stringify(genres),
            {status: 200} as Response,
        );
    } catch (error) {
        return new NextResponse(JSON.stringify({message: 'Internal server error'}),
            {status: 500} as Response,
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}