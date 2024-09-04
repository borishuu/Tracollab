import { PrismaClient } from '@prisma/client';

// Initialize the PrismaClient instance
const prisma = new PrismaClient();

// Handler of the PATCH method for updating the publication status of a comment.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Récupération de l'ID du commentaire à partir des paramètres

    // Check if the ID of the comment is provided
    if (!id) {
        return new Response(
            JSON.stringify({ error: 'ID of the comment is required' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        const currentPublishState = await prisma.comment.findUnique({
            where: { id },
            select: { publish: true },
        });

        // Check if the comment is found
        if (!currentPublishState) {
            return new Response(
                JSON.stringify({ error: 'Comment not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Update the comment, invert the ‘publish’ value
        const updatedComment = await prisma.comment.update({
            where: { id },
            data: { publish: !currentPublishState.publish },
        });

        return new Response(
            JSON.stringify({
                message: 'The comment has been updated successfully',
                comment: updatedComment,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error updating comment:', error);

        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } finally {
        // Disconnect the PrismaClient instance
        await prisma.$disconnect();
    }
}
