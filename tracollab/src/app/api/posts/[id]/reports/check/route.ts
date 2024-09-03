import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserData } from '@/app/api/user/route';

type Params = {
    id: string;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Params }) {
    try {
        const userId = await getUserData(request) as string;
        const postId = context.params.id;

        if (!postId || !userId) {
            console.error('Missing postId or userId');
            return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
        }

        const userReport = await prisma.userReport.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!userReport) {
            console.log('User report record not found');
            return NextResponse.json({ reported: false });
        }

        const report = await prisma.userReport.findFirst({
            where: {
                postId: postId,
                userId: userReport.id,
            },
        });

        console.log('Report:', report);
        return NextResponse.json({ reported: !!report });
    } catch (error) {
        console.error('Error fetching report status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
