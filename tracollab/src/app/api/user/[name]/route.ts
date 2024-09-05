import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { name: string } }) {
    const { name } = params;

    try {
        const user = await prisma.user.findFirst({
            where: { name: { mode: 'insensitive', equals: name } },
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

        if (!user) {
            await prisma.$disconnect();
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Séparer les posts en fonction de la présence d'instrumentals ou de voices
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

        await prisma.$disconnect();

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Déconnecter le client Prisma
        await prisma.$disconnect();

        console.error(error); // Afficher l'erreur dans les logs
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
