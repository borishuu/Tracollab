import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                postableSound: {
                    include: {
                        sound: {
                            include: {
                                genre: true, // Include the genre data
                            },
                        },
                    },
                },
                user: true, // Include user data
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
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}
