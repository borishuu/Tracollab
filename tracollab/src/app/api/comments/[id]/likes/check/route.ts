import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserData } from '@/app/api/user/route';

type Params = {
    id: string;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Params }) {
    try {
        // Retrieve user ID from the request
        const userId = await getUserData(request) as string;
        const commentId = context.params.id;

        if (!commentId || !userId) {
            console.error('Missing commentId or userId');
            return NextResponse.json({ error: 'Missing commentId or userId' }, { status: 400 });
        }

        const userLike = await prisma.userLike.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!userLike) {
            console.log('User like record not found');
            return NextResponse.json({ liked: false });
        }

        const like = await prisma.userLikeComment.findFirst({
            where: {
                commentId: commentId,
                userLikeId: userLike.id,
            },
        });

        console.log('LIKE:', like);
        return NextResponse.json({ liked: !!like });
    } catch (error) {
        console.error('Error fetching like status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
