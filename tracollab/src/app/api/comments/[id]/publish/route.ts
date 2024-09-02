import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Récupération de l'ID du commentaire à modifier

    try {
        // Vérification si l'ID du commentaire est fourni
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID of the comment is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

// Mise à jour du commentaire, définition de publish à l'opposé de sa valeur actuelle
        const updatedComment = await prisma.comment.update({
            where: {
                id: id,
            },
            data: {
                publish: {
                    // Inverse la valeur actuelle de "publish"
                    set: (await prisma.comment.findUnique({
                        where: { id: id },
                        select: { publish: true },
                    }))?.publish === true ? false : true,
                },
            },
        });


        await prisma.$disconnect(); // Déconnexion de Prisma

        return new Response(JSON.stringify({
            message: `The comment has been validated`,
            comment: updatedComment
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error updating comment:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect(); // Assurez-vous que Prisma est déconnecté
    }
}
