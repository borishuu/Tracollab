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
        const postId = context.params.id;

        if (!postId || !userId) {
            console.error('Missing postId or userId');
            return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
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

        // Check if the specific post is liked by the user
        const like = await prisma.userLikePost.findFirst({
            where: {
                postId: postId,
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
