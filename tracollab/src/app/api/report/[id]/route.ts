import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {cookies} from "next/headers";
import {jwtVerify} from "jose";

type Params = {
    id: string;
}

const prisma = new PrismaClient();
const REPORTS_TO_DELETE = 5; // Nombre de rapports avant la suppression du post

export async function GET(request: NextRequest, context: { params: Params }) {
    try {
        let userId;

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = cookies["authToken"];

        try {
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            console.error("Error getting user data");
            return new NextResponse(JSON.stringify(
                {error: "User not authenticated"}
            ), {status: 400});
        }

        const postId = context.params.id;

        if (!postId || !userId) {
            console.error('Missing postId or userId');
            return NextResponse.json({error: 'Missing postId or userId'}, {status: 400} as Response);
        }

        // Vérifier si l'utilisateur a déjà signalé ce post
        const existingReport = await prisma.userReport.findFirst({
            where: {
                userId: userId,
                postId: postId,
            },
        });

        if (existingReport) {
            return NextResponse.json({error: 'You have already reported this post'}, {status: 400} as Response);
        }

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
            return NextResponse.json({message: 'Post deleted due to multiple reports'}, {status: 200});
        }

        return NextResponse.json({message: 'Post reported successfully'}, {status: 200});
    } catch (error) {
        console.error('Error reporting post:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
