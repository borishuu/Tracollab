import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Récupérer les voix de la base de données
        const voices = await prisma.voice.findMany();

        return new NextResponse(JSON.stringify(voices), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
