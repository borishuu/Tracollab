import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {jwtVerify} from "jose";

type Params = {
    id: string;
}

const prisma = new PrismaClient();
const REPORTS_TO_DELETE = 5; // Nombre de rapports avant la suppression du post

export async function GET(req: NextRequest, context: { params: Params }) {
    try {
        let userId;

        // Récupérer le token d'authentification de l'utilisateur
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            // Vérifier le token JWT
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400} as Response);
        }

        // Récupérer l'ID du post
        const postId = context.params.id;

        // Vérifier les paramètres
        if (!postId || !userId) {
            return NextResponse.json({error: 'Missing postId or userId'}, {status: 400} as Response);
        }

        // Vérifier si l'utilisateur a déjà signalé ce post
        const existingReport = await prisma.userReport.findFirst({
            where: {
                userId: userId,
                postId: postId,
            },
        });
        if (existingReport)
            return NextResponse.json({error: 'You have already reported this post'}, {status: 400} as Response);

        // Créer un nouveau rapport
        await prisma.userReport.create({
            data: {
                userId: userId,
                postId: postId,
            },
        });

        // Compter le nombre total de rapports pour ce post
        const postReports = await prisma.userReport.count({
            where: {
                postId: postId,
            },
        });

        // Supprimer le post si le nombre de rapports dépasse le seuil
        if (postReports >= REPORTS_TO_DELETE) {
            await prisma.post.delete({
                where: {id: postId}
            });
            return NextResponse.json({message: 'Post deleted due to multiple reports'}, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response);
        }

        return NextResponse.json({message: 'Post reported successfully'}, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500} as Response);
    }
}
