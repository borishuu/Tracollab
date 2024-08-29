import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                sound: {
                    include: {
                        genre: true,
                    },
                },
                user: true,
                comments: true,
                likes: true,
                reports: true
            },
        });

        // Send the posts data back as a JSON response
        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}
