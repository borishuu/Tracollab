import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadToGc } from '@/app/lib/gcUpload';

const prisma = new PrismaClient();

// ID de genre par défaut ("Unknown")
const DEFAULT_GENRE_ID = '66d822bce76d99d3c2cc2355';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id: postId } = params;
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const content = formData.get('content') as string;
    const audioFile = formData.get('audioFile') as File | null;

    if (!userId || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        let soundId = null;

        if (audioFile) {
            // Utilisez la fonction uploadToGc pour télécharger le fichier
            const audioPath = await uploadToGc(audioFile, 'songs');

            // Créez un nouvel enregistrement Sound avec genre par défaut
            const newSound = await prisma.sound.create({
                data: {
                    title: audioFile.name,
                    audioPath: audioPath,
                    picture: "", // Vous pouvez définir une valeur par défaut ou gérer cela ultérieurement
                    genre: {
                        connect: { id: DEFAULT_GENRE_ID }, // Connecter à genre par défaut
                    },
                },
            });

            soundId = newSound.id;
        }

        console.log("2");

        // Créez un nouveau commentaire
        const newComment = await prisma.comment.create({
            data: {
                content,
                publish: false,
                postId,
                userId,
                soundId, // Incluez soundId seulement si l'audio est téléchargé
            },
        });

        console.log("3");

        return NextResponse.json({ comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
