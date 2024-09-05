import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {getUserData} from "@/app/lib/getUserData";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const {userId} = await request.json();
        const url = new URL(request.url);
        const commentId = url.pathname.split('/')[3];

        if (!commentId || !userId) {
            return NextResponse.json({error: 'Comment ID and User ID are required'}, {status: 400});
        }

        const existingLike = await prisma.userLikeComment.findFirst({
            where: {commentId, userLike: {userId}},
        });

        if (existingLike) {
            return NextResponse.json({error: 'Already liked'}, {status: 400});
        }

        let userLike = await prisma.userLike.findFirst({where: {userId}});

        if (!userLike) {
            userLike = await prisma.userLike.create({data: {userId}});
        }

        await prisma.userLikeComment.create({
            data: {
                commentId,
                userLikeId: userLike.id,
            },
        });

        return NextResponse.json({message: 'Like added successfully'}, {status: 200});
    } catch (error) {
        console.error('Error adding like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    try {
        const {userId} = await request.json();
        const url = new URL(request.url);
        const commentId = url.pathname.split('/')[3];

        if (!commentId || !userId) {
            return NextResponse.json({error: 'Comment ID and User ID are required'}, {status: 400});
        }

        const like = await prisma.userLikeComment.findFirst({
            where: {
                commentId,
                userLike: {userId},
            },
        });

        if (!like) {
            return NextResponse.json({error: 'Like not found'}, {status: 404});
        }

        await prisma.userLikeComment.delete({
            where: {id: like.id},
        });

        return NextResponse.json({message: 'Like removed successfully'}, {status: 200});
    } catch (error) {
        console.error('Error removing like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}


export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    const commentId = params.id;
    const userId = await getUserData(req) as string;

    if (!commentId) {
        return NextResponse.json({error: 'Comment ID is required'}, {status: 400});
    }

    try {
        // Compter le nombre de likes pour le commentaire
        const likesCount = await prisma.userLikeComment.count({
            where: {commentId},
        });

        // Vérifier si l'utilisateur a aimé le commentaire
        const userHasLiked = userId
            ? await prisma.userLikeComment.findFirst({
                where: {
                    commentId,
                    userLike: {userId}
                },
            })
            : null;

        return NextResponse.json({
            likesCount,
            userHasLiked: !!userHasLiked // Convertir en booléen pour plus de clarté
        }, {status: 200});
    } catch (error) {
        console.error('Error fetching likes count and user like status:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}