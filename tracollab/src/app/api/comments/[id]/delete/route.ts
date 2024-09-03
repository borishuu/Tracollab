import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient instance
const prisma = new PrismaClient();

// Handler for the DELETE method to remove a comment by its ID.
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Retrieve the comment ID from request parameters

    try {
        // Check if the comment ID is provided
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID of the comment is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const deletedComment = await prisma.comment.delete({
            where: { id: id },
        });

        return new Response(JSON.stringify(deletedComment), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        // Disconnect the PrismaClient instance
        await prisma.$disconnect();
    }
}
