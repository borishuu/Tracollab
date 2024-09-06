import {PrismaClient} from '@prisma/client';
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, {params}: { params: { name: string } }) {
    // Extraire le nom de l'utilisateur de la requête
    const {name} = params;

    try {
        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findFirst({
            where: {name: {mode: 'insensitive', equals: name}},
            include: {
                posts: {
                    include: {
                        user: true,
                        sound: {
                            include: {
                                instrumentals: true,
                                voices: true,
                                genre: true
                            }
                        }
                    }
                }
            }
        });

        // Vérifier si l'utilisateur existe
        if (!user) {
            // Déconnecter le client Prisma
            await prisma.$disconnect();

            return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404});
        }

        // Séparer les posts en fonction de la présence d'Instrumentals ou de Voices
        const postsWithInstrumentals = user.posts.filter(post => post.sound?.instrumentals?.length > 0);
        const postsWithVoices = user.posts.filter(post => post.sound?.voices?.length > 0);

        // Préparer la réponse avec les posts séparés
        const responseData = {
            userId: user.id,
            userName: user.name,
            profilePicture: user.profilePicture,
            joinDate: user.joinDate,
            postsWithInstrumentals,
            postsWithVoices,
            instrumentalCount: postsWithInstrumentals.length,
            voiceOverCount: postsWithVoices.length,
        };

        return new NextResponse(JSON.stringify(responseData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        } as Response);
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}), {status: 500} as Response);
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}
