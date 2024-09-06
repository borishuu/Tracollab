import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Extraire la query de la requête
    let {query} = await req.json() as { query: string };

    // Vérifier si la query est une chaîne de caractères
    if (typeof query !== 'string') {
        return new NextResponse(JSON.stringify(
                {error: "Invalid query"}),
            {status: 400} as Response
        );
    }

    // Supprimer les espaces inutiles
    query = query.trim().replace(/\s+/g, ' ');

    // Vérifier si la query est vide
    if (query.length === 0) {
        return new NextResponse(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    }

    try {
        // Rechercher les posts correspondant à la query
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    {
                        sound: {
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            },
            include: {
                sound: true,
                user: true,
            },
        });

        return new NextResponse(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {status: 500});
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
