import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    try {
        const likesCount = await prisma.userLikeComment.count({
            where: { commentId: id },
        });

        return NextResponse.json({ likesCount });
    } catch (error) {
        console.error('Error fetching likes count:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
