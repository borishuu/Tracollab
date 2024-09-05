import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { uploadToGc } from '@/lib/gcUpload';
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '100mb', // Set desired size limit here
      },
    },
  };

// ID de genre par défaut ("Unknown")
const DEFAULT_GENRE_ID = '66d822bce76d99d3c2cc2355';

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Params }) {
    try {
        const url = new URL(req.url);
        // const id = url.pathname.split('/').pop(); // Extract ID from URL

        const { id } = context.params as { id: string };

        if (!id) {
            return new NextResponse(JSON.stringify(
                { error: 'Post ID is required' }),
                { status: 400 } as Response
            );
        }

        // Get the parameter of the request
        // TODO: verifier si ca fonctionne toujours car publishParam est null
        const publishParam = url.searchParams.get('publish');
        const publish = publishParam === 'true'; // Convert in bool

        // Fetch comments for the specific post ID including user details and soundId
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

        return new Response(JSON.stringify({ comments: comments || [] }), { // Ensure comments is always an array
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
}



export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id: postId } = params;
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const content = formData.get('content') as string;
    const audioFile = formData.get('audioFile') as File | null;

    if (!userId || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 } as Response);
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

        return NextResponse.json({ comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

