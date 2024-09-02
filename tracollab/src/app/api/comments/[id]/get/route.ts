import { PrismaClient } from '@prisma/client';
import {useState} from "react";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    // On suppose que l'ID de la publication est passé en tant que paramètre de requête
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');  // Récupère l'ID de la publication depuis les paramètres de la requête
    const [comments, setComments] = useState<any[]>([]); // État pour les commentaires
    const [error, setError] = useState<string | null>(null);

    if (!postId) {
        return new Response(JSON.stringify({ error: 'postId is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Fetch comments
    const commentsResponse = await fetch(`/api/posts/comments/${postId}`);
    const commentsData = await commentsResponse.json();

    if (commentsData.error) {
        setError(commentsData.error);
        return;
    }

    setComments(commentsData.comments);

    try {
        // Requête pour récupérer les commentaires d'une publication et les détails de l'auteur
        const comments = await prisma.comment.findMany({
            where: { postId: postId },  // Remplacez `parseInt` par `BigInt` si vos IDs sont de type BigInt
            include: {
                user: {  // Inclut les détails de l'auteur du commentaire
                    select: {
                        name: true,
                        profilePicture: true,
                    },
                },
            },
        });

        // Mise en forme des résultats dans une map avec les détails demandés
        const commentsMap = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            user: {
                name: comment.user.name,
                profilePicture: comment.user.profilePicture
            },
        }));

        await prisma.$disconnect();  // Déconnexion de Prisma après la requête

        return new Response(JSON.stringify(commentsMap), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
