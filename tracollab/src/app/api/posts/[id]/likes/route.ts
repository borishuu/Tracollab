import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Extraire l'ID de l'utilisateur et l'ID du post à partir de la requête
        const {userId} = await request.json();
        const url = new URL(request.url);
        const postId = url.pathname.split('/')[3];

        // Vérifier si l'ID du post et l'ID de l'utilisateur sont présents
        if (!postId || !userId)
            return NextResponse.json({error: 'Post ID and User ID are required'}, {status: 400} as Response);

        // Vérifier si l'utilisateur a déjà aimé le post
        const existingLike = await prisma.userLikePost.findFirst({
            where: {postId, userLike: {userId}},
        });
        if (existingLike)
            return NextResponse.json({error: 'Already liked'}, {status: 400} as Response);

        // Sinon, créer un nouvel enregistrement de like
        let userLike = await prisma.userLike.create({data: {userId}});

        // Ajouter le like à la table de liaison
        await prisma.userLikePost.create({
            data: {
                postId,
                userLikeId: userLike.id,
            },
        });

        return NextResponse.json({message: 'Like added successfully'}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    try {
        // Extraire l'ID de l'utilisateur et l'ID du post à partir de la requête
        const {userId} = await request.json();
        const url = new URL(request.url);
        const postId = url.pathname.split('/')[3];

        // Vérifier si l'ID du post et l'ID de l'utilisateur sont présents
        if (!postId || !userId)
            return NextResponse.json({error: 'Post ID and User ID are required'}, {status: 400} as Response);

        // Récupérer le like de l'utilisateur pour le post
        const like = await prisma.userLikePost.findFirst({
            where: {
                postId,
                userLike: {userId},
            },
        });

        // Vérifier si le like existe
        if (!like)
            return NextResponse.json({error: 'Like not found'}, {status: 404});

        // Supprimer le like de la table de liaison
        await prisma.userLikePost.delete({
            where: {id: like.id},
        });

        return NextResponse.json({message: 'Like removed successfully'}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        await prisma.$disconnect();
    }
}
