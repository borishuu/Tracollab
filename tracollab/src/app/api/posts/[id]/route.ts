import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    // Extraire l'ID du paramètre de la requête
    const postId = params.id;

    try {
        // Récupérer le post avec l'ID spécifié
        const post = await prisma.post.findUnique({
            where: {id: postId},
            include: {
                sound: {
                    include: {
                        genre: true,
                    },
                },
                user: true,
                comments: {
                    include: {
                        user: true,
                    }
                },
                likes: true,
                reports: true
            },
        });

        // Vérifier si le post existe
        if (!post)
            return new NextResponse(JSON.stringify({error: 'Post not found'}),
                {status: 404} as Response,
            );

        let userId;

        // Récupérer le token d'authentification de l'utilisateur
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            // Vérifier le token et extraire l'ID de l'utilisateur
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            // Sinon définir l'ID de l'utilisateur à null
            userId = null;
        }

        let userConnectedAndLiked = false;

        // Vérifier si l'utilisateur est connecté et a aimé le post
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

        return new NextResponse(JSON.stringify({fetchedPost: post, userLiked: userConnectedAndLiked}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response,
        );
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response,
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    // Extraire l'ID du paramètre de la requête
    const {id} = params;

    // Vérifier si l'ID est défini
    if (!id)
        return new NextResponse(JSON.stringify(
                {error: "ID is required"}),
            {status: 400} as Response
        );

    try {
        // Supprimer le post avec l'ID spécifié
        await prisma.post.delete({
            where: {id}
        });

        return new NextResponse(JSON.stringify({message: 'Post deleted successfully'}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response,
        );
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response,
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
