import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const postId = params.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }, // Assuming IDs are strings in MongoDB
            include: {
                sound: {
                    include: {
                        genre: true, // Ensure the genre relation is defined correctly
                    },
                },
                user: true, // Include user data if needed
                comments: true,
                likes: true,
                reports: true
            },
        });

        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        console.log("test", post);

        return new Response(JSON.stringify(post), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching post:', error);
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
