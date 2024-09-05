import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const {userId} = await request.json();
        const url = new URL(request.url);
        const postId = url.pathname.split('/')[3]; // Extract postId from the path

        if (!postId || !userId) {
            return NextResponse.json({error: 'Post ID and User ID are required'}, {status: 400} as Response);
        }

        const existingLike = await prisma.userLikePost.findFirst({
            where: {postId, userLike: {userId}},
        });

        if (existingLike) {
            return NextResponse.json({error: 'Already liked'}, {status: 400} as Response);
        }

        let userLike = await prisma.userLike.findFirst({where: {userId}});

        if (!userLike) {
            userLike = await prisma.userLike.create({data: {userId}});
        }

        await prisma.userLikePost.create({
            data: {
                postId,
                userLikeId: userLike.id,
            },
        });

        return NextResponse.json({message: 'Like added successfully'}, {status: 200} as Response);
    } catch (error) {
        console.error('Error adding like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}


export async function DELETE(request: Request) {
    try {
        const {userId} = await request.json();
        const url = new URL(request.url);
        const postId = url.pathname.split('/')[3]; // Extract postId from the path

        if (!postId || !userId) {
            return NextResponse.json({error: 'Post ID and User ID are required'}, {status: 400} as Response);
        }

        const like = await prisma.userLikePost.findFirst({
            where: {
                postId,
                userLike: {userId},
            },
        });

        if (!like) {
            return NextResponse.json({error: 'Like not found'}, {status: 404});
        }

        await prisma.userLikePost.delete({
            where: {id: like.id},
        });

        return NextResponse.json({message: 'Like removed successfully'}, {status: 200} as Response);
    } catch (error) {
        console.error('Error removing like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        await prisma.$disconnect();
    }
}