import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Extraire l'ID de l'utilisateur et l'ID du commentaire à partir du corps de la requête
        const {userId} = await request.json();
        const url = new URL(request.url);
        const commentId = url.pathname.split('/')[3];

        // Vérifier si l'ID du commentaire et l'ID de l'utilisateur sont fournis
        if (!commentId || !userId)
            return NextResponse.json({error: 'Comment ID and User ID are required'}, {status: 400} as Response);

        // Vérifier si l'utilisateur a déjà aimé le commentaire
        const existingLike = await prisma.userLikeComment.findFirst({
            where: {commentId, userLike: {userId}},
        });

        // Si l'utilisateur a déjà aimé le commentaire, renvoyer une erreur
        if (existingLike)
            return NextResponse.json({error: 'Already liked'}, {status: 400} as Response);

        // Créer un nouvel enregistrement de like pour l'utilisateur
        let userLike = await prisma.userLike.findFirst({where: {userId}});

        // Si l'utilisateur n'a pas encore de like, en créer un
        if (!userLike)
            userLike = await prisma.userLike.create({data: {userId}});

        // Ajouter le like pour le commentaire
        await prisma.userLikeComment.create({
            data: {
                commentId,
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
        console.error('Error adding like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    try {
        // Extraire l'ID de l'utilisateur et l'ID du commentaire à partir du corps de la requête
        const {userId} = await request.json();
        const url = new URL(request.url);
        const commentId = url.pathname.split('/')[3];

        // Vérifier si l'ID du commentaire et l'ID de l'utilisateur sont fournis
        if (!commentId || !userId)
            return NextResponse.json({error: 'Comment ID and User ID are required'}, {status: 400} as Response);

        // Rechercher le like de l'utilisateur pour le commentaire
        const like = await prisma.userLikeComment.findFirst({
            where: {
                commentId,
                userLike: {userId},
            },
        });

        // Si le like n'est pas trouvé, renvoyer une erreur
        if (!like)
            return NextResponse.json({error: 'Like not found'}, {status: 404});

        // Supprimer le like pour le commentaire
        await prisma.userLikeComment.delete({
            where: {id: like.id},
        });

        return NextResponse.json({message: 'Like removed successfully'}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        console.error('Error removing like:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    // Extraire l'ID du commentaire à partir des paramètres de la requête
    const commentId = params.id;
    let userId;

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = req.cookies.get('authToken')?.value;

    try {
        const {payload} = await jwtVerify(token, secret);
        userId = payload.userId;
    } catch (error) {
        console.error("Error getting user data");
        return NextResponse.json({error: 'User not authenticated'}, {status: 400} as Response);
    }

    // Vérifier si l'ID du commentaire est fourni
    if (!commentId)
        return NextResponse.json({error: 'Comment ID is required'}, {status: 400} as Response);

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
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        console.error('Error fetching likes count and user like status:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
