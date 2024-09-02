import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Extract ID from URL

        if (!id) {
            return new Response(JSON.stringify({ error: 'Post ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get the parameter of the request
        const publishParam = url.searchParams.get('publish');
        const publish = publishParam === 'true'; // Convert in bool

        // Fetch comments for the specific post ID including user details and soundId
        const comments = await prisma.comment.findMany({
            where: {
                postId: id,
                publish: publish
            },
            select: {
                id: true,
                content: true,
                sound: {
                    select: {
                        title: true,
                        audioPath: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        profilePicture: true,
                    },
                },
            },
        });

        return new Response(JSON.stringify({ comments: comments || [] }), { // Ensure comments is always an array
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
}
