import { PrismaClient } from '@prisma/client';
import { getUserData } from "@/app/api/user/route";
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
                comments: {
                    include: {
                        user: true,
                    }
                },
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

        const userId = await getUserData(req) as string;

        let userConnectedAndLiked = false;

        if (userId) {
            const userLike = await prisma.userLike.findFirst({
                where: {
                    userId: userId,
                },
            });

            if (userLike) {
                const like = await prisma.userLikePost.findFirst({
                    where: {
                        postId: postId,
                        userLikeId: userLike.id,
                    },
                });

                if (like) {
                    userConnectedAndLiked = true;
                }
            }
        }

        return new Response(JSON.stringify(
        {
                fetchedPost: post,
                userLiked: userConnectedAndLiked
             }), {
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
