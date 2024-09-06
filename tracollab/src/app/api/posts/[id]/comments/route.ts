import {PrismaClient} from '@prisma/client';
import {NextResponse} from 'next/server';
import {uploadToGc} from '@/lib/gcUpload';
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

// ID de genre par défaut ("Unknown")
const DEFAULT_GENRE_ID = '66d822bce76d99d3c2cc2355';
const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Params }) {
    try {
        // Récupérer l'ID du post à partir de l'URL
        const url = new URL(req.url);
        const {id} = context.params as { id: string };

        // Vérifier si l'ID du post est manquant
        if (!id)
            return new NextResponse(JSON.stringify(
                    {error: 'Post ID is required'}),
                {status: 400} as Response
            );

        // Récupérer le paramètre de requête "publish" pour filtrer les commentaires
        const publishParam = url.searchParams.get('publish');
        const publish = publishParam === 'true'; // Convert in bool

        // Récupérer les commentaires pour le post spécifié
        const comments = await prisma.comment.findMany({
            where: {
                postId: id,
                publish: publish
            },
            select: {
                id: true,
                content: true,
                sound: {
                    select: {
                        title: true,
                        audioPath: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        profilePicture: true,
                    },
                },
            },
        });

        // S'assurer que les commentaires sont un tableau vide si aucun commentaire n'est trouvé
        return new NextResponse(JSON.stringify(comments || []), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            } as Response,
        );
    } catch (error) {
        return new NextResponse(JSON.stringify({error: 'Internal server error'}),
            {status: 500} as Response
        );
    } finally {
        // Déconnecter le client Prisma
        await prisma.$disconnect();
    }
}

export async function POST(request: Request, {params}: { params: { id: string } }) {
    // Extraire l'ID du post à partir des paramètres de la requête
    const {id: postId} = params;

    // Récupérer les données du formulaire de la requête
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const content = formData.get('content') as string;
    const audioFile = formData.get('audioFile') as File | null;

    // Vérifier si les champs obligatoires sont manquants
    if (!userId || !content)
        return NextResponse.json({error: 'Missing required fields'}, {status: 400} as Response);

    try {
        let soundId = null;

        // Vérifier si un fichier audio est téléchargé
        if (audioFile) {
            // Utiliser la fonction uploadToGc pour télécharger le fichier
            const audioPath = await uploadToGc(audioFile, 'songs');

            // Créer un nouvel enregistrement Sound avec genre par défaut
            const newSound = await prisma.sound.create({
                data: {
                    title: audioFile.name,
                    audioPath: audioPath,
                    picture: "", // Pas d'image en commentaire
                    genre: {
                        connect: {id: DEFAULT_GENRE_ID},
                    },
                },
            });

            // Enregistrer l'ID du son nouvellement créé
            soundId = newSound.id;
        }

        // Créer un nouveau commentaire avec les données fournies
        const newComment = await prisma.comment.create({
            data: {
                content,
                publish: false,
                postId,
                userId,
                soundId, // null si aucun fichier audio n'est téléchargé
            },
        });

        // Retourner le nouveau commentaire en tant que réponse
        return NextResponse.json({comment: newComment});
    } catch (error) {
        return NextResponse.json({error: 'Failed to create comment'}, {status: 500} as Response);
    }
}
