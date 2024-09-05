import {PrismaClient} from '@prisma/client';
import {NextRequest} from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    let {query} = await req.json() as { query: string };

    if (typeof query !== 'string') {
        return new Response(JSON.stringify({error: 'Invalid query'}), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    query = query.trim().replace(/\s+/g, ' ');

    if (query.length === 0) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
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

        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
