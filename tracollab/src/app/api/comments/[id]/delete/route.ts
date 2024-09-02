import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {

        if (!id) {
            return new Response(JSON.stringify({error: 'ID of the comment is required'}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const deletedComment = await prisma.comment.delete({
            where: {
                id: id,
            },
        });

        await prisma.$disconnect();

        return new Response(JSON.stringify({
            message: `The comment has been successfully deleted`
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}
