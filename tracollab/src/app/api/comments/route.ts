import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Récupérer tous les commentaires de la base de données
        const comments = await prisma.comment.findMany();

        return new Response(JSON.stringify(comments), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response,
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }


    // Retourner les commentaires en tant que réponse
}

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    // Extraire l'ID du commentaire à partir des paramètres de la requête
    const {id} = params;

    try {
        // Vérifier si l'ID du commentaire est fourni
        if (!id)
            return new NextResponse(JSON.stringify(
                    {error: "ID of the comment is required"}),
                {status: 400} as Response
            );

        // Supprimer le commentaire de la base de données
        const deletedComment = await prisma.comment.delete({
            where: {id: id},
        });

        // Retourner le commentaire supprimé en tant que réponse
        return new NextResponse(JSON.stringify(deletedComment), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        } as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal Server Error'}), {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
