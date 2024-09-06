import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {jwtVerify} from "jose";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        let userId;

        // Récupérer le token de l'utilisateur
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = req.cookies.get('authToken')?.value;

        try {
            // Vérifier le token
            const {payload} = await jwtVerify(token, secret);
            userId = payload.userId;
        } catch (error) {
            return new NextResponse(JSON.stringify({error: "User not authenticated"}), {status: 400} as Response);
        }

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        return NextResponse.json(user, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        } as Response);
    } catch (error) {
        return NextResponse.json({error: "Error fetching user "});
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
