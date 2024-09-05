import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request, {params}: { params: { id: string } }) {
    // Récupérer l'ID du commentaire
    const {id} = params;

    // Vérifier si l'ID est présent
    if (!id)
        return new NextResponse(JSON.stringify(
                {error: "ID of the comment is required"}),
            {status: 400} as Response,
        );

    try {
        // Récupérer l'état actuel de publication du commentaire
        const currentPublishState = await prisma.comment.findUnique({
            where: {id},
            select: {publish: true},
        });

        // Vérifier si le commentaire existe
        if (!currentPublishState)
            return new NextResponse(JSON.stringify(
                    {error: "Comment not found"}),
                {status: 404} as Response,
            );

        // Mettre à jour l'état de publication du commentaire
        const updatedComment = await prisma.comment.update({
            where: {id},
            data: {publish: !currentPublishState.publish},
        });

        return new NextResponse(JSON.stringify(updatedComment), {status: 200} as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: "Internal Server Error"}), {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
