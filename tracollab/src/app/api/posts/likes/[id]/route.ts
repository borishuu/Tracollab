import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Assuming URL pattern is /api/posts/[id]

        if (!id) {
            return new Response(JSON.stringify({ error: 'Post ID is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Fetch the specific post by ID with likes count
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                sound: {
                    include: {
                        genre: true,
                    },
                },
                user: true,
                comments: true,
                likes: true, // Include likes data from UserLikePost
                reports: true,
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

        // Count the number of likes for this post
        const likesCount = await prisma.userLikePost.count({
            where: { postId: id },
        });

        return new Response(JSON.stringify({ ...post, likesCount }), {
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

